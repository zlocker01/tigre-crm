import { NextResponse } from 'next/server';
import { getTrialClients } from '@/data/clients/getTrialClients';

export const dynamic = 'force-dynamic';

export async function GET() {
  const clients = await getTrialClients();

  if (!clients) {
    return NextResponse.json(
      { error: 'No se pudieron obtener las clases de prueba.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ clients });
}
