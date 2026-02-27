import { NextResponse } from 'next/server';
import { deleteEvent } from '@/data/events/deleteEvent';
import { createClient } from '@/utils/supabase/server';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const body = await req.json();
  const { is_active } = body;

  if (!id) {
    return NextResponse.json(
      { error: 'ID de evento requerido.' },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('events')
    .update({ is_active })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: 'Evento actualizado correctamente.',
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: 'ID de evento requerido.' },
      { status: 400 },
    );
  }

  const { error } = await deleteEvent(id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({
    message: 'Evento eliminado correctamente.',
  });
}
