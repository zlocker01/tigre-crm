import { NextResponse } from "next/server";
import { getClients } from "@/data/clients/getClients";
import { postClient } from "@/data/clients/postClient";

export async function GET() {
  const clients = await getClients();
  if (!clients) {
    return NextResponse.json(
      { error: "No se pudieron obtener los clientes." },
      { status: 500 },
    );
  }
  return NextResponse.json({ clients });
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = await postClient(body);
  
  if (!result.success) {
    return NextResponse.json(
      { error: "No se pudo crear el cliente." },
      { status: 500 },
    );
  }
  
  return NextResponse.json({ 
    message: "Cliente creado correctamente.",
    client: result.client 
  });
}
