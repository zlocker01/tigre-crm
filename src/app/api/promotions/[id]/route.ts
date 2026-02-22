import { NextResponse } from "next/server";
import { getPromotion } from "@/data/promotions/getPromotion";
import { updatePromotion } from "@/data/promotions/updatePromotion";
import { deletePromotion } from "@/data/promotions/deletePromotion";
import type { Promotion } from "@/interfaces/promotions/Promotion";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const promotionId = Number(params.id);

    if (isNaN(promotionId)) {
      return NextResponse.json(
        { error: "ID de promoción no válido" },
        { status: 400 },
      );
    }

    const promotion = await getPromotion(promotionId);
    if (!promotion) {
      return NextResponse.json(
        { error: "Promoción no encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json(promotion);
  } catch (error) {
    console.error("Error en GET /api/promotions/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al obtener la promoción" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const promotionId = Number(params.id);

    if (isNaN(promotionId)) {
      return NextResponse.json(
        { error: "ID de promoción no válido" },
        { status: 400 },
      );
    }

    const body = await req.json();
    
    // Check if this is just an active status toggle request
    const isToggleRequest = Object.keys(body).length === 1 && body.active !== undefined;
    
    let updateData: Partial<Omit<Promotion, "id" | "user_id">>;
    
    if (isToggleRequest) {
      // Only update the active status
      updateData = { active: body.active };
      console.log("Processing toggle request:", updateData);
    } else {
      // For full promotion updates, only include fields that are provided
      updateData = {};
      
      if (body.title !== undefined) updateData.title = body.title;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.price !== undefined) updateData.price = body.price;
      if (body.discount_price !== undefined) updateData.discount_price = body.discount_price;
      if (body.valid_until !== undefined) updateData.valid_until = body.valid_until;
      if (body.image !== undefined) updateData.image = body.image;
      if (body.active !== undefined) updateData.active = body.active;
    }

    const result = await updatePromotion(promotionId, updateData);

    if (typeof result === "string" && result.startsWith("Error")) {
      return NextResponse.json({ error: result }, { status: 400 });
    }

    // Obtener la promoción actualizada para devolverla
    const updatedPromotion = await getPromotion(promotionId);

    if (!updatedPromotion) {
      return NextResponse.json(
        { error: "Promoción actualizada pero no se pudo recuperar" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Promoción actualizada correctamente",
      promotion: updatedPromotion,
    });
  } catch (error) {
    console.error("Error en PUT /api/promotions/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al actualizar la promoción" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const promotionId = Number(params.id);

    if (isNaN(promotionId)) {
      return NextResponse.json(
        { error: "ID de promoción no válido" },
        { status: 400 },
      );
    }

    const result = await deletePromotion(promotionId);

    if (typeof result === "string" && result.startsWith("Error")) {
      return NextResponse.json({ error: result }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Promoción eliminada correctamente",
    });
  } catch (error) {
    console.error("Error en DELETE /api/promotions/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al eliminar la promoción" },
      { status: 500 },
    );
  }
}
