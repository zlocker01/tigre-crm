"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface ToggleEventButtonProps {
  eventId: string;
  isActive: boolean;
  onToggle?: (eventId: string, isActive: boolean) => void;
}

export function ToggleEventButton({
  eventId,
  isActive,
  onToggle = () => {},
}: ToggleEventButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState(isActive);

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      const newStatus = !active;
      
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el estado del evento");
      }

      setActive(newStatus);
      toast({
        title: newStatus ? "Evento activado" : "Evento desactivado",
        description: newStatus 
          ? "El evento ahora es visible en la página de inicio." 
          : "El evento ya no es visible en la página de inicio.",
        variant: "success",
      });
      
      onToggle(eventId, newStatus);
    } catch (error) {
      console.error("Error toggling event:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cambiar el estado del evento",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isLoading}
      title={active ? "Ocultar evento" : "Mostrar evento"}
    >
      {active ? (
        <Eye className="h-4 w-4 text-green-500" />
      ) : (
        <EyeOff className="h-4 w-4 text-gray-400" />
      )}
    </Button>
  );
}
