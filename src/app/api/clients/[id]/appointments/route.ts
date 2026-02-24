import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id: clientId } = await props.params;

  if (!clientId) {
    return NextResponse.json(
      { success: false, message: 'Falta el ID del cliente.' },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data: appointments, error } = await supabase
    .from('class_sessions')
    .select('*')
    .eq('client_id', clientId)

  if (error) {
    return NextResponse.json(
      { success: false, message: 'Error al obtener citas.', error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, appointments });
}
