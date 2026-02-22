import { useEffect } from "react";
import type { AppointmentFormValues } from "@/schemas/appointmentSchemas/appointmentSchema";
import type { UseFormReturn } from "react-hook-form";
import type { Appointment } from "@/interfaces/appointments/Appointment";
import type { Service } from "@/interfaces/services/Service";
import type { Promotion } from "@/interfaces/promotions/Promotion";

interface Params {
  form: UseFormReturn<AppointmentFormValues>;
  appointments: Appointment[];
  services: Service[];
  promotions: Promotion[];
  currentAppointmentId?: string; // Para excluir si estás editando una cita
}

export function useCategoryConflictChecker({
  form,
  appointments,
  services,
  promotions,
  currentAppointmentId,
}: Params) {
  const watchFields = form.watch([
    "start_datetime",
    "end_datetime",
    "service_id",
    "promotion_id",
  ]);

  useEffect(() => {
    const [startStr, endStr, serviceId, promotionId] = watchFields;
    if (!startStr || !endStr) {
      return;
    }

    const start = new Date(startStr);
    const end = new Date(endStr);

    let selectedCategory: string | null = null;

    const hasConflict = appointments.some((app) => {
      if (app.id === currentAppointmentId) {
        return false;
      } // omitimos la cita actual
      const appStart = new Date(app.start_datetime);
      const appEnd = new Date(app.end_datetime);

      const overlapping = start < appEnd && end > appStart;
      return overlapping;
    });

    if (hasConflict) {
      form.setError("start_datetime", {
        type: "manual",
        message: "Ya hay una cita en este horario.",
      });
    } else {
      form.clearErrors("start_datetime");
    }
  }, [
    watchFields,
    appointments,
    services,
    promotions,
    currentAppointmentId,
    form,
  ]);
}
