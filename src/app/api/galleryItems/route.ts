import { NextResponse } from "next/server";
import { getGalleryItems } from "@/data/galleryItems/getGalleryItems";
import { createGalleryItem } from "@/data/galleryItems/createGalleryItem";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const landingPageId = url.searchParams.get("landingPageId");

  if (!landingPageId) {
    return NextResponse.json(
      { error: "El parámetro landingPageId es requerido." },
      { status: 400 },
    );
  }

  const galleryItems = await getGalleryItems(landingPageId);
  if (!galleryItems) {
    return NextResponse.json(
      { error: "No se pudieron obtener los items de la galería." },
      { status: 500 },
    );
  }
  return NextResponse.json({ galleryItems });
}

export async function POST(req: Request) {
  const body = await req.json();
  const id = await createGalleryItem(body);
  if (!id) {
    return NextResponse.json(
      { error: "No se pudo crear el item de la galería." },
      { status: 500 },
    );
  }
  return NextResponse.json({
    message: "Item de galería creado correctamente.",
    id,
  });
}
