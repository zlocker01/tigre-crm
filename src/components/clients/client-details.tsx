'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  Mail,
  Phone,
  User,
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
import { ReceiptDownloader } from '@/components/receipts/ReceiptDownloader';

interface ClientDetailsProps {
  client: Client;
  onDeleteSuccess?: (clientId: Client['id']) => void;
  onNewAppointmentClick?: () => void;
}

export function ClientDetails({ client, onDeleteSuccess }: ClientDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
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

  // Función para generar los datos del recibo
  const generateReceiptData = () => {
    const receiptNumber = `REC-${Date.now().toString().slice(-6)}`;
    const today = new Date().toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Aquí puedes personalizar los datos de tu negocio
    const emitterData = {
      name: 'Tu Negocio S.A. de C.V.', // Actualiza con tu nombre o razón social
      rfc: 'TUCR123456XYZ', // Actualiza con tu RFC
      address: 'Calle Ejemplo 123, Col. Centro, Ciudad de México', // Actualiza con tu dirección
      phone: '55 1234 5678', // Actualiza con tu teléfono
      email: 'contacto@tunegocio.com', // Actualiza con tu email
    };

    const price = 500.0; // Precio del plan, puedes actualizarlo o traerlo de tus datos

    return {
      receiptNumber,
      date: today,
      emitter: emitterData,
      client: {
        name: client.name,
        email: client.email || '',
      },
      items: [
        {
          description: `Mensualidad - ${packageName || 'Plan sin nombre'}`,
          quantity: 1,
          unitPrice: price,
          total: price,
        },
      ],
      subtotal: price,
      total: price,
      paymentMethod: 'Tarjeta de crédito/débito',
    };
  };

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
        <User className="h-12 w-12 mb-4 opacity-20" />
        <p>Selecciona un alumno para ver sus detalles</p>
      </div>
    );
  }

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
              src="/app/avatar.png"
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

      <div className="grid gap-4 pt-4">
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
                  statusConfig[client.status as keyof typeof statusConfig] ||
                  statusConfig.active;

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
            <p className="text-sm font-medium leading-none">Plan contratado</p>
            <p className="text-sm text-muted-foreground">
              {packageName || 'Cargando...'}
            </p>
          </div>
        </div>

        {/* Botones de Recibos */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <ReceiptDownloader receiptData={generateReceiptData()} />
        </div>
      </div>
    </div>
  );
}
