import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { addMinutes } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const {
      service, // service_id as string
      promotion, // promotion_id as string
      date, // ISO string
      time, // HH:mm
      name,
      email,
      phone,
      notes,
    } = payload;

    const supabase = await createClient();

    // 1. Validar datos mínimos
    if (!date || !time || !name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios' },
        { status: 400 },
      );
    }

    if (!service && !promotion) {
      return NextResponse.json(
        { success: false, error: 'Debe seleccionar un servicio o promoción' },
        { status: 400 },
      );
    }

    // 2. Obtener duración y precio
    let durationMinutes = 30;
    let priceCharged = 0;
    let serviceId: number | null = null;
    let promotionId: number | null = null;

    if (service) {
      serviceId = parseInt(service);
      // Validar que el servicio existe
      const { data: serviceData } = await supabase
        .from('services')
        .select('id')
        .eq('id', serviceId)
        .single();

      if (serviceData) {
        // Clases tienen duración por defecto de 60 minutos y precio 0 (o según lógica de negocio futura)
        durationMinutes = 60;
        priceCharged = 0;
      }
    } else if (promotion) {
      promotionId = parseInt(promotion);
      const { data: promoData } = await supabase


      .from('promotions')
        .select('discount_price')
        .eq('id', promotionId)
        .single();

      if (promoData) {
        priceCharged = promoData.discount_price || 0;
      }
    }

    // 3. Calcular start_datetime y end_datetime
    // date viene como "2026-01-15T06:00:00.000Z" (ISO) o similar
    // time viene como "17:00"
    // Necesitamos combinar la fecha con la hora correcta

    // Parsear fecha base
    const baseDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);

    // Crear fecha de inicio en UTC/Local según corresponda
    // Asumimos que la fecha enviada ya es correcta o la ajustamos
    // Opción segura: crear fecha con año, mes, día de baseDate y hora de time
    const startDateTime = new Date(baseDate);
    startDateTime.setHours(hours, minutes, 0, 0);

    const endDateTime = addMinutes(startDateTime, durationMinutes);

    // 4. Gestionar Cliente (Buscar o Crear)
    let clientId: string;

    // Buscar por email
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email)
      .single();

    if (existingClient) {
      clientId = existingClient.id;
      // Opcional: Actualizar teléfono o nombre si cambiaron? Por ahora no para no sobrescribir datos importantes.
    } else {
      // Crear nuevo cliente
      const { data: newClient, error: createClientError } = await supabase
        .from('clients')
        .insert({
          name,
          email,
          phone,
          notes: notes ? `Nota de reserva: ${notes}` : undefined,
          client_source: 'web',
          status: 'trial', // Default to trial for web bookings if they are new? Or active? User said trial = Alumno nuevo.
          // user_id se deja nulo o se asigna a un admin por defecto si fuera necesario
        })
        .select('id')
        .single();

      if (createClientError || !newClient) {
        throw new Error(`Error creando cliente: ${createClientError?.message}`);
      }
      clientId = newClient.id;
    }

    // 5. Crear Cita
    const { data: newAppointment, error: createAppointmentError } =
      await supabase
        .from('class_sessions')
        .insert({
          client_id: clientId,
          service_id: serviceId,
          promotion_id: promotionId,
          start_datetime: startDateTime.toISOString(),
          end_datetime: endDateTime.toISOString(),
          status: 'Confirmada', // O 'Pendiente' según flujo
          notes: notes,
          price_charged: priceCharged,
          actual_duration_minutes: durationMinutes,
          appointment_source: 'web',
          // user_id: null // Se deja nulo ya que es una reserva pública
        })
        .select('*')
        .single();

    if (createAppointmentError) {
      throw new Error(`Error creando cita: ${createAppointmentError.message}`);
    }

    return NextResponse.json({
      success: true,
      data: {
        appointment: newAppointment,
        clientId,
      },
    });
  } catch (error: any) {
    console.error('Error en POST /api/booking:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error procesando la reserva',
        details: error.message,
      },
      { status: 500 },
    );
  }
}
