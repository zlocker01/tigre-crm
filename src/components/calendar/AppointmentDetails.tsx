'use client';

import { Button } from '@/components/ui/button';
import { Calendar, User, X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import type { ClassSession } from '@/interfaces/appointments/Appointment';
import { Client } from '@/interfaces/client/Client';
import { Service } from '@/interfaces/services/Service';

interface AppointmentDetailsProps {
  appointment: ClassSession | null;
  clients: Client[];
  services: Service[];
  onEdit: (appointment: ClassSession) => void;
  onClose: () => void;
  onAppointmentCancelled?: () => void;
}

export function AppointmentDetails({
  appointment,
  clients,
  services,
  onEdit,
  onClose,
  onAppointmentCancelled,
}: AppointmentDetailsProps) {
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteOption, setDeleteOption] = useState<'single' | 'series'>(
    'single',
  );

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
        <Calendar className="h-12 w-12 mb-4 opacity-20" />
        <p>Selecciona una clase para ver sus detalles</p>
      </div>
    );
  }

  const handleCancelAppointment = async () => {
    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Cancelada' }),
      });

      if (!response.ok) {
        throw new Error('Error al cancelar la clase');
      }

      setShowCancelDialog(false);
      onClose();
      if (onAppointmentCancelled) {
        onAppointmentCancelled();
      }
      toast({
        title: 'Clase cancelada',
        description: 'La clase ha sido cancelada correctamente.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error al cancelar la clase:', error);
      toast({
        title: 'Error',
        description:
          'No se pudo cancelar la clase. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAppointment = async () => {
    try {
      const queryParams =
        deleteOption === 'series' ? '?applyTo=series' : '?applyTo=single';
      const response = await fetch(
        `/api/appointments/${appointment.id}${queryParams}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar la clase');
      }

      setShowDeleteDialog(false);
      onClose();
      if (onAppointmentCancelled) {
        onAppointmentCancelled();
      }
      toast({
        title: 'Clase eliminada',
        description:
          deleteOption === 'series'
            ? 'La serie completa ha sido eliminada correctamente.'
            : 'La clase ha sido eliminada correctamente.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error al eliminar la clase:', error);
      toast({
        title: 'Error',
        description:
          'No se pudo eliminar la clase. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg shadow-md bg-white dark:bg-slate-950">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">Detalles de la Clase</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {appointment?.client_id && (
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {clients.find((client) => client.id === appointment?.client_id)
                  ?.name || 'Cliente no encontrado'}
              </p>
              <p className="text-sm text-muted-foreground">
                {
                  clients.find((client) => client.id === appointment?.client_id)
                    ?.email
                }
              </p>
              <p className="text-sm text-muted-foreground">
                {
                  clients.find((client) => client.id === appointment?.client_id)
                    ?.phone
                }
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">
              {format(
                new Date(appointment?.start_datetime),
                "EEEE d 'de' MMMM",
                { locale: es },
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(appointment.start_datetime), 'HH:mm')} -{' '}
              {format(new Date(appointment.end_datetime), 'HH:mm')}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Servicio</p>
          {(() => {
            const service = services.find(
              (s) => s.id === appointment.service_id,
            );
            return service ? (
              <>
                <p>{service.title}</p>
              </>
            ) : (
              <p>Sin servicio</p>
            );
          })()}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Estado</p>
          <Badge
            variant={
              appointment.status === 'Confirmada'
                ? 'confirmada'
                : appointment.status === 'Cancelada'
                  ? 'cancelada'
                  : 'proceso'
            }
          >
            {appointment.status === 'Confirmada'
              ? 'Confirmada'
              : appointment.status === 'Cancelada'
                ? 'Cancelada'
                : 'Confirmada'}
          </Badge>
        </div>

        {/* Notas eliminadas */}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Eliminar registro"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowCancelDialog(true)}
          disabled={appointment.status === 'Cancelada'}
        >
          Cancelar clase
        </Button>
        <Button
          size="sm"
          onClick={() => onEdit(appointment)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Editar
        </Button>
      </div>

      {/* Diálogo de confirmación de cancelación */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cancelar clase?</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <div className="font-medium">
                {
                  clients.find((client) => client.id === appointment?.client_id)
                    ?.name
                }
              </div>
              <div className="text-sm">
                Servicio:{' '}
                {
                  services.find(
                    (service) => service.id === appointment?.service_id,
                  )?.title
                }
              </div>
              <div className="text-sm text-muted-foreground">
                {format(
                  new Date(appointment.start_datetime),
                  "EEEE d 'de' MMMM",
                  { locale: es },
                )}{' '}
                • {format(new Date(appointment.start_datetime), 'HH:mm')} -{' '}
                {format(new Date(appointment.end_datetime), 'HH:mm')}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer. La clase será marcada como
              cancelada y se liberará el horario.
            </p>
          </div>

          <DialogFooter className="flex justify-between gap-3 md:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Volver
            </Button>
            <Button variant="destructive" onClick={handleCancelAppointment}>
              Sí, cancelar clase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar registro?</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Esta acción eliminará permanentemente el registro de la base de
              datos. A diferencia de cancelar, esto borrará la clase por
              completo.
            </p>

            {appointment.series_id && (
              <div className="space-y-3 pt-2">
                <Label className="text-base font-medium">
                  Opciones de eliminación
                </Label>
                <RadioGroup
                  value={deleteOption}
                  onValueChange={(val) =>
                    setDeleteOption(val as 'single' | 'series')
                  }
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single" id="del-single" />
                    <Label htmlFor="del-single">Solo esta clase</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="series" id="del-series" />
                    <Label htmlFor="del-series">
                      Toda la serie (todas las repeticiones)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between gap-3 md:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAppointment}
              className="bg-red-700 hover:bg-red-800"
            >
              {deleteOption === 'series' && appointment.series_id
                ? 'Eliminar toda la serie'
                : 'Eliminar esta clase'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
