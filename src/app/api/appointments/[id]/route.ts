import { type NextRequest, NextResponse } from 'next/server';
import { getAppointmentById } from '@/data/appointments/getAppointmentById';
import { deleteAppointment } from '@/data/appointments/deleteAppointment';
import { updateAppointment } from '@/data/appointments/updateAppointment';
import { createClient } from '@/utils/supabase/server';
import { addDays, addYears, getDay } from 'date-fns';
import { getUserId } from '@/data/getUserIdServer';

export async function GET(
  _: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  const appointment = await getAppointmentById(params.id);
  if (!appointment) {
    return NextResponse.json({ error: 'Cita no encontrada.' }, { status: 404 });
  }
  return NextResponse.json({ appointment });
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  console.log('PUT /api/appointments/[id] called with id:', params.id);
  try {
    const body = await req.json();
    console.log('Request body:', body);

    const { applyTo, ...updateData } = body as Record<string, any> & {
      applyTo?: 'single' | 'future' | 'series';
    };
    console.log('applyTo:', applyTo);
    console.log('updateData:', updateData);

    // Limpiar datos antes de actualizar
    if (updateData.client_id === '') {
      updateData.client_id = null;
    }

    // Actualización por defecto: solo esta clase
    if (!applyTo || applyTo === 'single') {
      const updatedAppointment = await updateAppointment(params.id, updateData);
      if (!updatedAppointment) {
        return NextResponse.json(
          { error: 'Cita no encontrada o no se pudo actualizar.' },
          { status: 404 },
        );
      }
      return NextResponse.json({
        message: 'Clase actualizada correctamente.',
        appointment: updatedAppointment,
      });
    }

    // Obtener la clase para conocer series_id y start_datetime
    const current = await getAppointmentById(params.id);
    if (!current?.series_id) {
      // Si no pertenece a serie, degradamos a actualización simple
      const updatedAppointment = await updateAppointment(params.id, updateData);
      if (!updatedAppointment) {
        return NextResponse.json(
          { error: 'Cita no encontrada o no se pudo actualizar.' },
          { status: 404 },
        );
      }
      return NextResponse.json({
        message: 'Clase actualizada (no pertenece a serie).',
        appointment: updatedAppointment,
      });
    }

    const supabase = await createClient();

    if (applyTo === 'series') {
      // Verificar si hay cambio en los días de recurrencia
      // Los días vienen en updateData.recurring_days si se enviaron
      const hasRecurrenceChange = updateData.recurring_days && Array.isArray(updateData.recurring_days) && updateData.recurring_days.length > 0;
      
      if (hasRecurrenceChange) {
         // REGENERACIÓN DE SERIE
         // 1. Borrar todas las citas futuras de la serie (incluyendo la actual si se regenera todo, o desde hoy)
         // Para simplificar "Editar Serie", borraremos TODAS las futuras desde HOY (o desde la fecha de la cita editada)
         // y regeneraremos.
         // PERO, si el usuario quiere cambiar los días de TODA la serie, implica que las pasadas también deberían haber sido así,
         // lo cual es imposible de cambiar.
         // Estrategia: Borrar futuras desde la fecha de inicio de la cita actual y regenerar.
         
         const startDate = new Date(updateData.start_datetime || current.start_datetime);
         
         // Borrar futuras (>= startDate)
         const { error: deleteError } = await supabase
            .from('class_sessions')
            .delete()
            .eq('series_id', current.series_id)
            .gte('start_datetime', startDate.toISOString());
            
         if (deleteError) {
             return NextResponse.json({ error: deleteError.message }, { status: 500 });
         }

         // 2. Regenerar nuevas citas
         const userId = await getUserId();
         
         // Calcular duración base
         const startDt = new Date(updateData.start_datetime || current.start_datetime);
         const endDt = new Date(updateData.end_datetime || current.end_datetime);
         const durationMs = endDt.getTime() - startDt.getTime();
         const durationMinutes = Math.floor(durationMs / (1000 * 60));

         const appointmentsToInsert = [];
         // Usar la fecha de inicio de la cita actual como base
         let currentDateIterator = startDt;
         
         // Límite: fecha fin de recurrencia o 1 año
         const limitDate = updateData.recurring_end_date
            ? new Date(updateData.recurring_end_date)
            : addYears(new Date(), 1);
         limitDate.setHours(23, 59, 59, 999);

         const recurringDays = updateData.recurring_days; // Array de días (0-6)

         while (currentDateIterator <= limitDate) {
            const currentDayOfWeek = getDay(currentDateIterator);

            if (recurringDays.includes(currentDayOfWeek)) {
                const startForDay = new Date(currentDateIterator);
                // Mantener hora
                startForDay.setHours(startDt.getHours(), startDt.getMinutes(), 0, 0);
                
                const endForDay = new Date(startForDay.getTime() + durationMs);

                appointmentsToInsert.push({
                    client_id: updateData.client_id ?? current.client_id,
                    service_id: updateData.service_id ?? current.service_id,
                    status: updateData.status ?? current.status,
                    user_id: userId,
                    series_id: current.series_id, // Mantenemos el mismo ID de serie
                    start_datetime: startForDay.toISOString(),
                    end_datetime: endForDay.toISOString(),
                    // Otros campos que puedan ser necesarios
                });
            }
            currentDateIterator = addDays(currentDateIterator, 1);
         }
         
         if (appointmentsToInsert.length > 0) {
             const { error: insertError } = await supabase
                .from('class_sessions')
                .insert(appointmentsToInsert);
                
             if (insertError) {
                 return NextResponse.json({ error: insertError.message }, { status: 500 });
             }
         }

         return NextResponse.json({
            message: 'Serie regenerada con nuevos días de recurrencia.',
            applyTo: 'series',
         });
      }

      // Calcular diferencia de tiempo si se actualizan fechas (SIN cambiar días de recurrencia)
      const newStart = updateData.start_datetime
        ? new Date(updateData.start_datetime)
        : null;
      const currentStart = new Date(current.start_datetime);
      const timeDiff = newStart
        ? newStart.getTime() - currentStart.getTime()
        : 0;

      // Si hay cambio de fecha/hora, actualizar una por una preservando la diferencia
      if (newStart && timeDiff !== 0) {
        // Obtener todas las citas de la serie
        const { data: seriesAppointments, error: fetchError } = await supabase
          .from('class_sessions')
          .select('*')
          .eq('series_id', current.series_id);

        if (fetchError) {
          return NextResponse.json(
            { error: fetchError.message },
            { status: 500 },
          );
        }

        if (!seriesAppointments || seriesAppointments.length === 0) {
          return NextResponse.json(
            { message: 'No se encontraron citas de la serie.' },
            { status: 404 },
          );
        }

        // Actualizar cada una
        const updates = seriesAppointments.map(async (app) => {
          const appStart = new Date(app.start_datetime);
          const appEnd = new Date(app.end_datetime);

          const newAppStart = new Date(appStart.getTime() + timeDiff);
          const newAppEnd = new Date(appEnd.getTime() + timeDiff);

          return supabase
            .from('class_sessions')
            .update({
              ...updateData,
              start_datetime: newAppStart.toISOString(),
              end_datetime: newAppEnd.toISOString(),
            })
            .eq('id', app.id);
        });

        await Promise.all(updates);

        return NextResponse.json({
          message: 'Serie actualizada correctamente con ajuste de fechas.',
          applyTo: 'series',
        });
      }

      // Si no hay cambio de fecha, actualización masiva directa
      // IMPORTANTE: Excluimos start_datetime y end_datetime para evitar sobrescribir las fechas de otras clases con la fecha de esta clase
      const { start_datetime, end_datetime, ...dataWithoutDates } = updateData;

      const { error } = await supabase
        .from('class_sessions')
        .update(dataWithoutDates)
        .eq('series_id', current.series_id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({
        message: 'Serie actualizada correctamente.',
        applyTo: 'series',
      });
    }

    if (applyTo === 'future') {
      // Calcular diferencia de tiempo si se actualizan fechas
      const newStart = updateData.start_datetime
        ? new Date(updateData.start_datetime)
        : null;
      const currentStart = new Date(current.start_datetime);
      const timeDiff = newStart
        ? newStart.getTime() - currentStart.getTime()
        : 0;

      if (newStart && timeDiff !== 0) {
        const { data: futureAppointments, error: fetchError } = await supabase
          .from('class_sessions')
          .select('*')
          .eq('series_id', current.series_id)
          .gte('start_datetime', current.start_datetime);

        if (fetchError) {
          return NextResponse.json(
            { error: fetchError.message },
            { status: 500 },
          );
        }

        if (!futureAppointments || futureAppointments.length === 0) {
          return NextResponse.json(
            { message: 'No se encontraron citas futuras.' },
            { status: 404 },
          );
        }

        const updates = futureAppointments.map(async (app) => {
          const appStart = new Date(app.start_datetime);
          const appEnd = new Date(app.end_datetime);

          const newAppStart = new Date(appStart.getTime() + timeDiff);
          const newAppEnd = new Date(appEnd.getTime() + timeDiff);

          return supabase
            .from('class_sessions')
            .update({
              ...updateData,
              start_datetime: newAppStart.toISOString(),
              end_datetime: newAppEnd.toISOString(),
            })
            .eq('id', app.id);
        });

        await Promise.all(updates);

        return NextResponse.json({
          message: 'Clases futuras actualizadas con ajuste de fechas.',
          applyTo: 'future',
        });
      }

      const { error } = await supabase
        .from('class_sessions')
        .update(updateData)
        .eq('series_id', current.series_id)
        .gte('start_datetime', current.start_datetime);

      if (error) {
        console.error('Error updating future appointments:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({
        message: 'Clases futuras de la serie actualizadas correctamente.',
        applyTo: 'future',
      });
    }

    const updatedAppointment = await updateAppointment(params.id, updateData);
    if (!updatedAppointment) {
      return NextResponse.json(
        { error: 'Cita no encontrada o no se pudo actualizar.' },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: 'Clase actualizada correctamente.',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Unexpected error in PUT /api/appointments/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  const error = await deleteAppointment(params.id);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({
    message: 'Cita eliminada correctamente.',
  });
}
