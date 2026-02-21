import { NextResponse } from 'next/server';
import { updateInventoryItem } from '@/data/inventory/updateInventoryItem';
import { deleteInventoryItem } from '@/data/inventory/deleteInventoryItem';
import type { InventoryItem } from '@/interfaces/inventory/InventoryItem';

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return NextResponse.json(
      { success: false, error: 'ID inválido' },
      { status: 400 }
    );
  }

  try {
    const body = (await request.json()) as Partial<InventoryItem>;

    const { data, error, code } = await updateInventoryItem(numericId, body);

    if (!data) {
      const status =
        code === '42501' || /permission denied/i.test(error || '') ? 403 : 500;

      return NextResponse.json(
        {
          success: false,
          error: error || 'No se pudo actualizar el producto',
          code,
        },
        { status },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error en PUT /api/inventory/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno al actualizar producto' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return NextResponse.json(
      { success: false, error: 'ID inválido' },
      { status: 400 }
    );
  }

  try {
    const ok = await deleteInventoryItem(numericId);

    if (!ok) {
      return NextResponse.json(
        { success: false, error: 'No se pudo eliminar el producto' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en DELETE /api/inventory/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno al eliminar producto' },
      { status: 500 }
    );
  }
}
