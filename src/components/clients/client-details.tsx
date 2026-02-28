'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Mail,
  Phone,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pencil,
  Trash,
  CreditCard,
  Activity,
} from 'lucide-react';
import { ClientForm } from '@/components/clients/client-form';
import { formatDate } from '@/lib/date-utils';
import type { ClientFormValues } from '@/schemas/clientSchemas/clientSchema';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import type { Client } from '@/interfaces/client/Client';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Hook para obtener las citas reales del cliente
function useClientAppointments(clientId: string) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/clients/${clientId}/appointments`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Error al obtener citas');
        const data = await res.json();
        setAppointments(data.appointments || []);
      })
      .catch((err) => {
        setError(err.message || 'Error desconocido');
        setAppointments([]);
      })
      .finally(() => setLoading(false));
  }, [clientId]);

  return { appointments, loading, error };
}

interface ClientDetailsProps {
  client: Client;
  onDeleteSuccess?: (clientId: Client['id']) => void;
  onNewAppointmentClick?: () => void;
}

export function ClientDetails({
  client,
  onDeleteSuccess,
  onNewAppointmentClick,
}: ClientDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [packageName, setPackageName] = useState<string>('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (client.package_id) {
      fetch('/api/packages')
        .then((res) => res.json())
        .then((data) => {
          const targetId =
            typeof client.package_id === 'string'
              ? Number(client.package_id)
              : client.package_id;
          const pkg = data.packages?.find((p: any) => p.id === targetId);
          if (pkg) setPackageName(pkg.name);
          else setPackageName('Plan no encontrado');
        })
        .catch((err) => {
          console.error('Error fetching packages', err);
          setPackageName('Error al cargar plan');
        });
    } else {
      setPackageName('Sin plan');
    }
  }, [client.package_id]);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
        <User className="h-12 w-12 mb-4 opacity-20" />
        <p>Selecciona un alumno para ver sus detalles</p>
      </div>
    );
  }

  const {
    appointments: clientAppointments,
    loading: loadingAppointments,
    error: errorAppointments,
  } = useClientAppointments(client.id);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (data: ClientFormValues) => {
    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el alumno');
      }
      setIsEditing(false);
      toast({
        title: 'Alumno actualizado',
        description:
          'La información del alumno ha sido actualizada correctamente.',
        variant: 'success',
      });
      router.refresh(); // Refresca los datos de la página actual (Server Components)
      // window.location.reload(); // Ya no es necesario recargar toda la página
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el alumno.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteClient = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/clients/${client.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Error al eliminar el alumno' }));
        throw new Error(errorData.message || 'Error al eliminar el alumno');
      }
      toast({
        title: 'Alumno eliminado',
        description: `El alumno ${client.name} ha sido eliminado correctamente.`,
        variant: 'success',
      });
      setIsDeleteDialogOpen(false);
      if (onDeleteSuccess) {
        onDeleteSuccess(client.id);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo eliminar el alumno.',
        variant: 'destructive',
      });
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <ClientForm
        defaultValues={{
          name: client.name,
          email: client.email ?? '',
          phone: client.phone ?? '',
          registration_date: client.registration_date,
          status: client.status,
          package_id: client.package_id ?? '',
        }}
        onSubmit={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src="/app/avatar.jpg"
              alt={client.name}
              className="object-cover"
            />
            <AvatarFallback>
              {client.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{client.name}</h3>
            <p className="text-sm text-muted-foreground">
              Alumno desde{' '}
              {client.registration_date &&
              !isNaN(new Date(client.registration_date).getTime())
                ? formatDate(client.registration_date)
                : 'Fecha desconocida'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará
                  permanentemente al alumno y todos sus datos asociados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteClient}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="appointments">Citas</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="space-y-6 pt-4">
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Correo electrónico
                </p>
                <p className="text-sm text-muted-foreground">
                  {client.email || 'No registrado'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Teléfono (WhatsApp)
                </p>
                <p className="text-sm text-muted-foreground">
                  {client.phone || 'No registrado'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Fecha de inscripción
                </p>
                <p className="text-sm text-muted-foreground">
                  {client.registration_date &&
                  !isNaN(new Date(client.registration_date).getTime())
                    ? formatDate(client.registration_date)
                    : 'Fecha desconocida'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Estatus</p>
                <div className="pt-1">
                  {(() => {
                    const statusConfig = {
                      active: {
                        label: 'Activo',
                        className: 'bg-green-500 hover:bg-green-600',
                      },
                      pending_payment: {
                        label: 'Pago pendiente',
                        className: 'bg-yellow-500 hover:bg-yellow-600',
                      },
                      suspended: {
                        label: 'Suspendido',
                        className: 'bg-red-500 hover:bg-red-600',
                      },
                      paused: {
                        label: 'En pausa',
                        className: 'bg-blue-500 hover:bg-blue-600',
                      },
                      trial: {
                        label: 'Clase de prueba',
                        className: 'bg-purple-500 hover:bg-purple-600',
                      },
                      injured: {
                        label: 'Lesionado',
                        className: 'bg-orange-500 hover:bg-orange-600',
                      },
                      inactive: {
                        label: 'Baja definitiva',
                        className: 'bg-slate-500 hover:bg-slate-600',
                      },
                    };

                    const config =
                      statusConfig[
                        client.status as keyof typeof statusConfig
                      ] || statusConfig.active;

                    return (
                      <Badge className={config.className}>{config.label}</Badge>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Plan contratado
                </p>
                <p className="text-sm text-muted-foreground">
                  {packageName || 'Cargando...'}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <div className="flex flex-col gap-2 mb-4">
            <p className="text-sm">
              Total de citas:{' '}
              <span className="font-semibold">{clientAppointments.length}</span>
            </p>
            <p className="text-sm">
              Citas confirmadas:{' '}
              <span className="font-semibold">
                {
                  clientAppointments.filter((a) => a.status === 'Confirmada')
                    .length
                }
              </span>
            </p>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="pt-4">
          {/* Aquí iría la lista de citas, pero no está implementada en el código original visible, solo el hook */}
          <p className="text-muted-foreground text-sm">
            Funcionalidad de citas en desarrollo...
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
