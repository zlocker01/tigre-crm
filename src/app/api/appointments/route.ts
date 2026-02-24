import { NextRequest, NextResponse } from 'next/server';
import { getAppointments } from '@/data/appointments/getAppointments';
import { createAppointment } from '@/data/appointments/createAppointment';
import { getUserId } from '@/data/getUserIdServer';
import { createClient } from '@/utils/supabase/server';
import { addDays, addYears, getDay } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const appointments = await getAppointments();

    // Si el usuario está autenticado y es admin o empleado, devolver todos los datos
    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userData?.role === 'admin' || userData?.role === 'empleado') {
        return NextResponse.json({
          success: true,
          data: appointments,
        });
      }
    }

    // Filtrar datos sensibles para proteger la privacidad
    // Solo devolvemos la fecha y hora para calcular disponibilidad
    const publicAppointments = appointments?.map((app) => ({
      start_datetime: app.start_datetime,
      end_datetime: app.end_datetime,
      status: app.status,
    }));

    return NextResponse.json({
      success: true,
      data: publicAppointments,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch appointments',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      landingPageId,
      is_recurring,
      recurring_days,
      recurring_end_date,
      ...appointmentPayload
    } = await request.json();

    const supabase = await createClient();
    const userId = await getUserId();

    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Calcular duración; el precio se gestiona fuera de esta API
    let duration_minutes: number | null = null;

    // Calcular duración basada en start y end datetime seleccionados
    let finalStartDateTime = new Date(appointmentPayload.start_datetime);
    let finalEndDateTime: Date;

    if (appointmentPayload.end_datetime) {
      finalEndDateTime = new Date(appointmentPayload.end_datetime);
    } else {
      // Fallback: 1 hora por defecto si no se envía end_datetime
      finalEndDateTime = new Date(
        finalStartDateTime.getTime() + 60 * 60 * 1000,
      );
    }

    const diffMs = finalEndDateTime.getTime() - finalStartDateTime.getTime();
    duration_minutes = Math.floor(diffMs / (1000 * 60));

    const baseAppointmentData = {
      client_id: appointmentPayload.client_id || null,
      service_id: appointmentPayload.service_id || null,
      promotion_id: null, // Ya no usamos promociones explícitamente en el form
      status: appointmentPayload.status || 'Confirmada',
      notes: '', // Ya no usamos notas
      user_id: userId,
      appointment_source: userData?.role || 'web',
      actual_duration_minutes: duration_minutes,
      price_charged: null,
    };

    if (is_recurring && recurring_days && recurring_days.length > 0) {
      const seriesId = globalThis.crypto?.randomUUID
        ? globalThis.crypto.randomUUID()
        : Math.random().toString(36).slice(2) +
          Math.random().toString(36).slice(2);
      const appointmentsToInsert = [];
      const startDate = finalStartDateTime;
      // Si no hay fecha fin, por defecto 1 año
      const limitDate = recurring_end_date
        ? new Date(recurring_end_date)
        : addYears(new Date(), 1);

      // Asegurarnos de que el límite incluya el final del día
      limitDate.setHours(23, 59, 59, 999);

      let currentDateIterator = startDate;

      // Iteramos día por día
      while (currentDateIterator <= limitDate) {
        const currentDayOfWeek = getDay(currentDateIterator); // 0 = Domingo, 1 = Lunes...

        if (recurring_days.includes(currentDayOfWeek)) {
          // Construir las fechas para este día específico manteniendo la hora original
          const startForDay = new Date(currentDateIterator);
          startForDay.setHours(
            finalStartDateTime.getHours(),
            finalStartDateTime.getMinutes(),
            0,
            0,
          );

          const endForDay = new Date(currentDateIterator);
          // Si la cita termina al día siguiente (cruza medianoche), hay que manejarlo,
          // pero por simplicidad asumimos mismo día o sumamos la duración
          const endTimeMs =
            startForDay.getTime() + duration_minutes! * 60 * 1000;
          const calculatedEnd = new Date(endTimeMs);

          appointmentsToInsert.push({
            ...baseAppointmentData,
            series_id: seriesId,
            start_datetime: startForDay.toISOString(),
            end_datetime: calculatedEnd.toISOString(),
          });
        }

        currentDateIterator = addDays(currentDateIterator, 1);
      }

      if (appointmentsToInsert.length === 0) {
        // Caso borde: ninguna fecha coincidió (ej. usuario selecciona Martes pero rango es solo Lunes)
        // Podríamos forzar al menos la fecha de inicio si coincide, o lanzar error.
        // Por ahora, si el usuario eligió mal los días vs fecha, no se crea nada.
        return NextResponse.json(
          {
            success: false,
            error:
              'No appointments generated with selected recurrence settings.',
          },
          { status: 400 },
        );
      }

      const { data: createdAppointments, error: insertError } = await supabase
        .from('class_sessions')
        .insert(appointmentsToInsert)
        .select();

      if (insertError) throw insertError;

      return NextResponse.json(
        {
          success: true,
          data: createdAppointments,
          count: createdAppointments.length,
        },
        { status: 201 },
      );
    } else {
      // Creación única (sin recurrencia)
      const singleAppointmentData = {
        ...baseAppointmentData,
        start_datetime: finalStartDateTime.toISOString(),
        end_datetime: finalEndDateTime.toISOString(),
      };

      const { data: newAppointment, error: insertError } = await supabase
        .from('class_sessions')
        .insert([singleAppointmentData])
        .select()
        .single();

      if (insertError) throw insertError;

      return NextResponse.json(
        {
          success: true,
          data: newAppointment,
        },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create appointment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
