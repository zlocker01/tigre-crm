import { NextResponse } from "next/server";
import { getEvents } from "@/data/events/getEvents";
import { createEvent } from "@/data/events/createEvent";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const landingPageId = searchParams.get("landingPageId");

  if (!landingPageId) {
    return NextResponse.json(
      { error: "ID de página de aterrizaje requerido." },
      { status: 400 },
    );
  }

  const { data, error } = await getEvents(landingPageId);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ events: data });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { landing_id, image_url } = body;

    if (!landing_id || !image_url) {
        return NextResponse.json(
            { error: "Faltan datos requeridos (landing_id, image_url)" },
            { status: 400 }
        );
    }

    const { data, error } = await createEvent({ landing_id, image_url });
    
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    
    return NextResponse.json({
      message: "Evento creado correctamente.",
      data,
    });
  } catch (err) {
      return NextResponse.json({ error: "Error procesando la solicitud" }, { status: 500 });
  }
}
