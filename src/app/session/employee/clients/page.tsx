'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ClientsTable } from '@/components/clients/clients-table';
import { ClientDetails } from '@/components/clients/client-details';
import { Plus, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClientForm } from '@/components/clients/client-form';
import { useToast } from '@/components/ui/use-toast';
import type { ClientFormValues } from '@/schemas/clientSchemas/clientSchema';
import { mutate } from 'swr';
import type { Client } from '@/interfaces/client/Client';

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateClient = async (data: ClientFormValues) => {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast({
        title: 'Alumno creado',
        description: `El alumno ${data.name} ha sido creado correctamente.`,
        variant: 'success',
      });
      setIsNewClientDialogOpen(false);
      mutate('/api/clients'); // <-- Esto recarga la lista automáticamente
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo crear el alumno.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteClientSuccess = (deletedClientId: Client['id']) => {
    if (selectedClient && selectedClient.id === deletedClientId) {
      setSelectedClient(null); // Limpiar la selección si el cliente eliminado era el seleccionado
    }
    mutate('/api/clients'); // Actualizar la lista de clientes
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Alumnos</h1>
        <p className="text-muted-foreground">
          Gestiona la información de tus alumnos
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 order-2 lg:order-1">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
              <div>
                <CardTitle>Lista de Alumnos</CardTitle>
                <CardDescription>
                  Gestiona y busca entre tus alumnos
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {/* <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button> */}
                <Button
                  size="sm"
                  className="flex-1 sm:flex-none"
                  onClick={() => setIsNewClientDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Alumno
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>
              <ClientsTable
                searchQuery={searchQuery}
                onClientSelect={setSelectedClient}
                selectedClientId={selectedClient?.id}
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-80 order-1 lg:order-2">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Alumno</CardTitle>
              <CardDescription>
                {selectedClient
                  ? 'Información detallada del alumno'
                  : 'Selecciona un alumno para ver detalles'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedClient && (
                <ClientDetails
                  client={selectedClient}
                  onDeleteSuccess={handleDeleteClientSuccess}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Diálogo para crear nuevo alumno */}
      <Dialog
        open={isNewClientDialogOpen}
        onOpenChange={setIsNewClientDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Alumno</DialogTitle>
            <DialogDescription>
              Completa el formulario para añadir un nuevo alumno a tu base de
              datos.
            </DialogDescription>
          </DialogHeader>
          <ClientForm
            defaultValues={{
              name: '',
              email: '',
              phone: '',
              notes: '',
            }}
            onSubmit={handleCreateClient}
            onCancel={() => setIsNewClientDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
