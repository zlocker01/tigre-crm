import { NextResponse } from "next/server";
import { getPromotions } from "@/data/promotions/getPromotions";
import { createPromotion } from "@/data/promotions/createPromotion";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const landingPageId = url.searchParams.get("landingPageId");
  const includeInactive = url.searchParams.get("includeInactive") === "true";

  if (!landingPageId) {
    return NextResponse.json(
      { error: "El parámetro landingPageId es requerido." },
      { status: 400 },
    );
  }

  const promotions = await getPromotions(landingPageId, includeInactive);
  if (!promotions) {
    return NextResponse.json(
      { error: "No se pudieron obtener las promociones." },
      { status: 500 },
    );
  }
  return NextResponse.json({ promotions });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.landing_page_id) {
      return NextResponse.json(
        { error: "El campo landing_page_id es requerido." },
        { status: 400 },
      );
    }

    const success = await createPromotion({
      title: body.title,
      description: body.description,
      price: body.price,
      discount_price: body.discount_price,
      valid_until: body.valid_until,
      image: body.image,
      landing_page_id: body.landing_page_id,
    });

    if (!success) {
      return NextResponse.json(
        { error: "No se pudo crear la promoción." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Promoción creada correctamente.",
    });
  } catch (error) {
    console.error("Error in POST /api/promotions:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar la solicitud." },
      { status: 500 },
    );
  }
}
