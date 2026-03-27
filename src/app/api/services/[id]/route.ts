import { NextResponse } from "next/server";
import { getService } from "@/data/services/getService";
import { updateService } from "@/data/services/updateService";
import { deleteService } from "@/data/services/deleteService";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const service = await getService(Number(params.id));
  if (!service) {
    return NextResponse.json(
      { error: "Servicio no encontrado." },
      { status: 404 },
    );
  }
  return NextResponse.json({ service });
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 },
      );
    }

    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (roleError || userData?.role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado para actualizar servicios" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const serviceId = Number(params.id);
    const result = await updateService(serviceId, body);

    // Si result es un string que comienza con 'Error', es un mensaje de error
    if (typeof result === "string" && result.startsWith("Error")) {
      return NextResponse.json({ error: result }, { status: 400 });
    }

    // Si llegamos aquí, result es el ID del servicio actualizado
    return NextResponse.json({
      success: true,
      message: "Servicio actualizado correctamente",
      id: result,
    });
  } catch (error) {
    console.error("Error en la API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al actualizar el servicio" },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: userData, error: roleError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (roleError || userData?.role !== "admin") {
    return NextResponse.json(
      { error: "No autorizado para eliminar servicios" },
      { status: 403 },
    );
  }

  const error = await deleteService(Number(params.id));
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ message: "Servicio eliminado correctamente." });
}
