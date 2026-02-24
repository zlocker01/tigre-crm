import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ClassSession } from '@/interfaces/appointments/Appointment';

interface TrialClassConfirmationProps {
  appointment: ClassSession;
  serviceName: string;
  onClose: () => void;
}

export function TrialClassConfirmation({
  appointment,
  serviceName,
  onClose,
}: TrialClassConfirmationProps) {
  const dateStr = format(new Date(appointment.start_datetime), "EEEE d 'de' MMMM", { locale: es });
  const timeStr = format(new Date(appointment.start_datetime), 'HH:mm');

  return (
    <div className="p-6 text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-green-700">¡Clase Confirmada!</h3>
        <p className="text-muted-foreground">
          Tu clase de prueba ha sido agendada exitosamente.
        </p>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg space-y-3 text-left">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <span className="font-bold text-primary">🥋</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Clase</p>
            <p className="font-semibold">{serviceName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Fecha</p>
            <p className="font-semibold capitalize">{dateStr}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Hora</p>
            <p className="font-semibold">{timeStr}</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Recomendación:</strong> Por favor llega 10 minutos antes de tu clase para prepararte y conocer las instalaciones.
        </p>
      </div>

      <Button onClick={onClose} className="w-full">
        Entendido
      </Button>
    </div>
  );
}
