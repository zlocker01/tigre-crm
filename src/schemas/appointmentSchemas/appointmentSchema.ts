import { z } from 'zod';

export const appointmentSchema = z.object({
  client_id: z.string().optional().nullable(),
  service_id: z
    .number()
    .nullable()
    .transform((val) => (val === undefined ? null : val)),
  start_datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'La fecha de inicio debe ser una fecha válida',
  }),
  end_datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'La fecha de fin debe ser una fecha válida',
  }),
  status: z.string().optional(),
  // Campos de recurrencia (no se guardan en BD directamente, se procesan)
  is_recurring: z.boolean().optional(),
  recurring_days: z.array(z.number()).optional(), // 0 = Domingo, 1 = Lunes, ...
  recurring_end_date: z.string().optional().nullable(),
  applyTo: z.enum(['single', 'future', 'series']).optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
