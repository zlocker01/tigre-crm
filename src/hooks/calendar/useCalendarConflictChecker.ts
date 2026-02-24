import { useEffect } from 'react';
import type { AppointmentFormValues } from '@/schemas/appointmentSchemas/appointmentSchema';
import type { UseFormReturn } from 'react-hook-form';
import type { ClassSession } from '@/interfaces/appointments/Appointment';

interface Params {
  form: UseFormReturn<AppointmentFormValues>;
  appointments: ClassSession[];
  currentAppointmentId?: string;
}

export function useCategoryConflictChecker({
  form,
  appointments,
  currentAppointmentId,
}: Params) {
  const watchFields = form.watch(['start_datetime', 'end_datetime']);

  useEffect(() => {
    const [startStr, endStr] = watchFields;
    if (!startStr || !endStr) {
      return;
    }

    const start = new Date(startStr);
    const end = new Date(endStr);

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
      form.setError('start_datetime', {
        type: 'manual',
        message: 'Ya hay una cita en este horario.',
      });
    } else {
      form.clearErrors('start_datetime');
    }
  }, [watchFields, appointments, currentAppointmentId, form]);
}
