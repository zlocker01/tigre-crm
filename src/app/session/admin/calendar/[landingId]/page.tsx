'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useCalendarData } from '@/hooks/calendar/useCalendarData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { format, addDays, isBefore, getDay, addYears } from 'date-fns';
import { es } from 'date-fns/locale';
import { AppointmentCalendar } from '@/components/calendar/AppointmentCalendar';
import { AppointmentDetails } from '@/components/calendar/AppointmentDetails';
import { AppointmentDialog } from '@/components/calendar/AppointmentDialog';
import { CalendarSkeleton } from '@/components/skeletons/calendar/calendar-skeleton';

import type { ClassSession } from '@/interfaces/appointments/Appointment';
import { NewClientDialog } from '@/components/clients/NewClientDialog';
import type { ClientFormValues } from '@/schemas/clientSchemas/clientSchema';

export default function CalendarPage() {
  const params = useParams();
  const { toast } = useToast();
  const landingId = params.landingId as string;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<ClassSession | null>(null);
  const [view, setView] = useState('month');
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);

  // Nueva función para manejar la selección de clase
  const handleAppointmentSelect = (appointment: ClassSession) => {
    setSelectedAppointment(appointment);
  };

  const handleDateChange = (date: Date) => {
    console.log(date);
  };

  const {
    appointments = [],
    clients = [],
    services = [],
    isLoading,
    error,
    mutate,
  } = useCalendarData(landingId);

  const handleCreateClient = async (data: ClientFormValues) => {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast({
        title: 'Cliente creado',
        description: `El cliente ${data.name} ha sido creado correctamente.`,
        variant: 'success',
      });
      setIsNewClientDialogOpen(false);
      mutate(); // Recargar todos los datos del calendario, incluyendo los clientes
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo crear el cliente.',
        variant: 'destructive',
      });
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const isEditing = !!selectedAppointment;

      if (isEditing && selectedAppointment) {
        // Actualizar cita existente
        // Soportamos "editar serie" mediante el campo applyTo que viene en data

        // Si es actualización de serie, necesitamos enviar también los datos de recurrencia
        // por si han cambiado
        let updatePayload = { ...data };

        if (data.applyTo !== 'series') {
          const {
            is_recurring,
            recurring_days,
            recurring_end_date,
            ...singleUpdateData
          } = data;
          updatePayload = singleUpdateData;
        } else {
          // Si es serie, nos aseguramos de que is_recurring sea true para que el backend sepa qué hacer
          updatePayload.is_recurring = true;
        }

        const res = await fetch(`/api/appointments/${selectedAppointment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Error al actualizar la cita');
        }
      } else {
        // Crear nueva cita (única o recurrente)
        // Enviamos todo el payload al backend, que manejará la recurrencia
        const res = await fetch(`/api/appointments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Error al crear la cita');
        }
      }

      toast({
        title: isEditing ? 'Clase actualizada' : 'Clase(s) creada(s)',
        description: `Se han procesado correctamente.`,
        variant: 'success',
      });

      setIsFormOpen(false);
      mutate();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? `No se pudo guardar la clase: ${error.message}`
            : 'No se pudo guardar la clase. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        Error al cargar los datos: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Encabezado y botón */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Horario de Clases
          </h1>
          <p className="text-muted-foreground">
            Administra tus clases en tiempo real desde aquí
          </p>
          <p className="text-goldAccent font-bold" suppressHydrationWarning>
            {format(new Date(), "EEEE d 'de' MMMM 'de' yyyy, hh:mm a", {
              locale: es,
            })}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto self-end md:self-auto">
          <Button
            onClick={() => {
              setSelectedAppointment(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Clase
          </Button>
        </div>
      </div>

      {/* Grid responsive */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-10 gap-4">
        <div className="col-span-1 lg:col-span-7">
          <AppointmentCalendar
            view={view as 'month' | 'week' | 'day'}
            onViewChange={setView}
            appointments={appointments}
            services={services}
            isLoading={isLoading}
            error={error}
            onDateChange={handleDateChange}
            onAppointmentSelect={handleAppointmentSelect}
          />
        </div>
        <div className="col-span-1 lg:col-span-3">
          <AppointmentDetails
            appointment={selectedAppointment}
            clients={clients}
            services={services}
            onEdit={() => {
              if (selectedAppointment) {
                setIsFormOpen(true);
              }
            }}
            onClose={() => setSelectedAppointment(null)}
            onAppointmentCancelled={() => mutate()}
          />
        </div>
      </div>

      {/* Formulario en modal */}
      <AppointmentDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        appointment={selectedAppointment}
        services={services}
      />

      {/* Diálogo para crear nuevo cliente */}
      <NewClientDialog
        open={isNewClientDialogOpen}
        onOpenChange={setIsNewClientDialogOpen}
        onSubmit={handleCreateClient}
      />
    </div>
  );
}
