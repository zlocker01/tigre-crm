'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchableSelect } from './form-fields/SearchableSelect';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Scissors, Loader2, CalendarClock } from 'lucide-react';

import {
  appointmentSchema,
  type AppointmentFormValues,
} from '@/schemas/appointmentSchemas/appointmentSchema';
import type { Appointment } from '@/interfaces/appointments/Appointment';
import type { Client } from '@/interfaces/client/Client';
import type { Service } from '@/interfaces/services/Service';
import { DateTimeSelector } from './form-fields/TimeSelector';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface AppointmentFormProps {
  appointment?: Appointment;
  services: Service[];
  onSubmit: (data: AppointmentFormValues) => Promise<void>;
  onCancel: (appointment: Appointment | null) => void;
}

const DAYS_OF_WEEK = [
  { label: 'D', value: 0 },
  { label: 'L', value: 1 },
  { label: 'M', value: 2 },
  { label: 'X', value: 3 },
  { label: 'J', value: 4 },
  { label: 'V', value: 5 },
  { label: 'S', value: 6 },
];

export function AppointmentForm({
  appointment,
  services,
  onSubmit,
  onCancel,
}: AppointmentFormProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      client_id: appointment?.client_id || '',
      service_id: appointment?.service_id ?? null,
      start_datetime: appointment?.start_datetime || '',
      end_datetime: appointment?.end_datetime || '',
      status: 'Confirmada',
      is_recurring: false,
      recurring_days: [],
      recurring_end_date: null,
      applyTo: 'single',
    },
    mode: 'onChange',
  });

  const { isSubmitting } = form.formState;
  const isRecurring = form.watch('is_recurring');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Servicio */}
          <SearchableSelect
            control={form.control}
            name="service_id"
            label="Servicio"
            placeholder="Selecciona un servicio"
            notFoundMessage="Servicio no encontrado."
            options={services.map((service) => ({
              value: service.id.toString(),
              label: `${service.title}`,
            }))}
            icon={<Scissors className="mr-2 h-4 w-4 opacity-50" />}
            onValueChange={(value, onChange) => {
              onChange(value ? Number(value) : null);
            }}
          />
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DateTimeSelector
            control={form.control}
            name="start_datetime"
            label="Inicio"
            disabled={isSubmitting}
          />
          <DateTimeSelector
            control={form.control}
            name="end_datetime"
            label="Fin"
            disabled={isSubmitting}
          />
        </div>

        {/* Recurrencia */}
        <div className="space-y-4 border rounded-md p-4 bg-muted/20">
          <FormField
            control={form.control}
            name="is_recurring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Repetir clase</FormLabel>
                  <FormDescription>
                    Marca esta opción si la clase se repite periódicamente.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {isRecurring && (
            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
              <FormField
                control={form.control}
                name="recurring_days"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Días de la semana
                      </FormLabel>
                      <FormDescription>
                        Selecciona los días que se repite la clase.
                      </FormDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <FormField
                          key={day.value}
                          control={form.control}
                          name="recurring_days"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={day.value}
                                className="flex items-center space-y-0"
                              >
                                <FormControl>
                                  <div
                                    className={cn(
                                      'flex h-10 w-10 items-center justify-center rounded-full border cursor-pointer transition-colors hover:bg-accent',
                                      field.value?.includes(day.value)
                                        ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                                        : 'bg-background border-input',
                                    )}
                                    onClick={() => {
                                      const current = field.value || [];
                                      const updated = current.includes(
                                        day.value,
                                      )
                                        ? current.filter(
                                            (val) => val !== day.value,
                                          )
                                        : [...current, day.value];
                                      field.onChange(updated);
                                    }}
                                  >
                                    {day.label}
                                  </div>
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recurring_end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha límite (Opcional)</FormLabel>
                    <FormDescription>
                      Deja vacío para repetir indefinidamente (se crearán citas
                      para el próximo año).
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? field.value.split('T')[0] : ''}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value ? e.target.value : null,
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* Selector de alcance de edición para series */}
        {appointment?.series_id && (
          <div className="space-y-4 border rounded-md p-4 bg-muted/20">
            <FormField
              control={form.control}
              name="applyTo"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Aplicar cambios a...</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="single" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Solo esta clase
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="series" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Todas las clases de la serie
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onCancel(appointment || null)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : appointment ? (
              'Actualizar clase'
            ) : (
              'Crear clase'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
