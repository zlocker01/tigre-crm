import { useMemo, useCallback } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import type { AppointmentFormValues } from "@/schemas/appointmentSchemas/appointmentSchema";
import type { Service } from "@/interfaces/services/Service";
import type { Promotion } from "@/interfaces/promotions/Promotion";

interface UseAppointmentAutoUpdateProps {
  form: UseFormReturn<AppointmentFormValues>;
  services: Service[];
  promotions: Promotion[];
}

export function useAppointmentAutoUpdate({
  form,
  services,
  promotions,
}: UseAppointmentAutoUpdateProps) {
  const control = form.control;

  const selectedServiceId = useWatch({ control, name: "service_id" });
  const selectedPromotionId = useWatch({ control, name: "promotion_id" });
    
  const { selectedService, selectedPromotion, durationMinutes } =
    useMemo(() => {
      const service = services.find((s) => s.id === selectedServiceId);
      const promotion = promotions.find((p) => p.id === selectedPromotionId);

      return {
        selectedService: service,
        selectedPromotion: promotion,
        durationMinutes: 30,
      };
    }, [selectedServiceId, selectedPromotionId, services, promotions]);

  // Exclusividad entre servicio y promoción: se maneja con onBlur
  const handleServiceBlur = useCallback(() => {
    if (form.getValues("promotion_id")) {
      form.setValue("promotion_id", null, { shouldValidate: false });
    }
  }, [form]);

  const handlePromotionBlur = useCallback(() => {
    if (form.getValues("service_id")) {
      form.setValue("service_id", null, { shouldValidate: false });
    }
  }, [form]);

  // Actualizar automáticamente fecha fin

  return {
    selectedService,
    selectedPromotion,
    durationMinutes,
    handleServiceBlur,
    handlePromotionBlur,
  };
}
