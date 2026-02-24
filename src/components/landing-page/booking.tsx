'use client';

import React, { useState } from 'react';
import { AppointmentCalendar } from '@/components/calendar/AppointmentCalendar';
import { useCalendarData } from '@/hooks/calendar/useCalendarData';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AppointmentDetails } from '@/components/calendar/AppointmentDetails';
import { Button } from '@/components/ui/button';
import type { ClassSession } from '@/interfaces/appointments/Appointment';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TrialClassForm } from './trial-class-form';
import { TrialClassConfirmation } from './trial-class-confirmation';
import { useToast } from '@/components/ui/use-toast';

export default function Booking({ landingId = '' }: { landingId?: string }) {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedAppointment, setSelectedAppointment] =
    useState<ClassSession | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<
    'details' | 'form' | 'confirmation'
  >('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    appointments,
    services,
    clients, // Necesario para AppointmentDetails aunque no se use para mostrar cliente en booking público
    isLoading,
    error,
  } = useCalendarData(landingId);

  const handleAppointmentSelect = (appointment: ClassSession) => {
    setSelectedAppointment(appointment);
    setBookingStep('details');
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedAppointment(null);
    setBookingStep('details');
  };

  const handleStartBooking = () => {
    setBookingStep('form');
  };

  const handleFormSubmit = async (data: { name: string; phone: string }) => {
    if (!selectedAppointment) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          status: 'trial',
          notes: `Clase prueba solicitada para: ${services.find((s) => s.id === selectedAppointment.service_id)?.title || 'Clase'} - ${format(new Date(selectedAppointment.start_datetime), 'dd/MM/yyyy HH:mm')}`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al registrar');
      }

      setBookingStep('confirmation');
      toast({
        title: '¡Registro exitoso!',
        description: 'Tu clase de prueba ha sido confirmada.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error booking class:', error);
      toast({
        title: 'Error',
        description:
          'No se pudo completar el registro. Por favor intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceName = selectedAppointment
    ? services.find((s) => s.id === selectedAppointment.service_id)?.title ||
      'Clase'
    : 'Clase';

  return (
    <section id="booking" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Agendar Clase Gratis
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Consulta nuestros horarios y agenda tu clase prueba gratis.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <AppointmentCalendar
            view={view}
            onViewChange={setView}
            appointments={appointments}
            services={services}
            isLoading={isLoading}
            error={error}
            onAppointmentSelect={handleAppointmentSelect}
          />
        </div>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none">
            <DialogTitle className="sr-only">
              {bookingStep === 'details'
                ? 'Detalles de la clase'
                : bookingStep === 'form'
                  ? 'Formulario de registro'
                  : 'Confirmación'}
            </DialogTitle>
            <div className="bg-background rounded-lg shadow-lg w-full">
              {bookingStep === 'details' && (
                <AppointmentDetails
                  appointment={selectedAppointment}
                  clients={clients}
                  services={services}
                  onClose={handleCloseDetails}
                  readOnly={true}
                  customAction={
                    <Button
                      onClick={handleStartBooking}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded"
                    >
                      Agendar esta clase prueba gratis
                    </Button>
                  }
                />
              )}

              {bookingStep === 'form' && (
                <div className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => setBookingStep('details')}
                      className="text-sm"
                    >
                      ← Volver
                    </Button>
                    <h3 className="font-semibold text-lg">
                      Confirmar Asistencia
                    </h3>
                    <div className="w-16"></div> {/* Spacer for centering */}
                  </div>

                  <div className="bg-muted/30 p-3 rounded-md mb-4 text-sm">
                    <p>
                      <strong>Clase:</strong> {serviceName}
                    </p>
                    <p>
                      <strong>Fecha:</strong>{' '}
                      {selectedAppointment &&
                        format(
                          new Date(selectedAppointment.start_datetime),
                          "EEEE d 'de' MMMM, HH:mm",
                          { locale: es },
                        )}
                    </p>
                  </div>

                  <TrialClassForm
                    onSubmit={handleFormSubmit}
                    isLoading={isSubmitting}
                  />
                </div>
              )}

              {bookingStep === 'confirmation' && selectedAppointment && (
                <TrialClassConfirmation
                  appointment={selectedAppointment}
                  serviceName={serviceName}
                  onClose={handleCloseDetails}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
