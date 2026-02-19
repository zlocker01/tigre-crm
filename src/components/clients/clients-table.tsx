'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import useSWR from 'swr';
import type { Client } from '@/interfaces/client/Client';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ClientsTableRowSkeleton } from '../skeletons/clients/table-row-skeleton';

interface ClientsTableProps {
  searchQuery: string;
  onClientSelect: (client: Client) => void;
  selectedClientId?: string;
}

export function ClientsTable({
  searchQuery,
  onClientSelect,
  selectedClientId,
}: ClientsTableProps) {
  const [page, setPage] = useState(1);
  const pageSize = 5; // Usaremos esto para determinar cuántas filas de esqueleto mostrar
  const { data, isLoading } = useSWR('/api/clients', async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    return data.clients || [];
  });

  const clients = data || [];

  const { data: packagesData } = useSWR('/api/packages', async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    return data.packages || [];
  });

  const getPackageName = (packageId?: string) => {
    if (!packageId || !packagesData) return '-';
    const targetId =
      typeof packageId === 'string' ? Number(packageId) : packageId;
    const pkg = packagesData.find((p: any) => p.id === targetId);
    return pkg ? pkg.name : '-';
  };

  const filteredClients = clients.filter((client: Client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.phone?.includes(query)
    );
  });

  const totalPages = Math.ceil(filteredClients.length / pageSize);
  const paginatedClients = filteredClients.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto rounded-md border">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Fecha de inscripción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <ClientsTableRowSkeleton key={`skeleton-${index}`} />
              ))
            ) : paginatedClients.length > 0 ? (
              paginatedClients.map((client: Client) => (
                <TableRow
                  key={client.id}
                  className={`cursor-pointer ${client.id === selectedClientId ? 'bg-muted' : ''}`}
                  onClick={() => onClientSelect(client)}
                >
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="table-cell">{client.email}</TableCell>
                  <TableCell className="table-cell">{client.phone}</TableCell>
                  <TableCell>
                    {(() => {
                      const statusConfig = {
                        active: { label: 'Activo', className: 'bg-green-500 hover:bg-green-600' },
                        pending_payment: { label: 'Pago pendiente', className: 'bg-yellow-500 hover:bg-yellow-600' },
                        suspended: { label: 'Suspendido', className: 'bg-red-500 hover:bg-red-600' },
                        paused: { label: 'En pausa', className: 'bg-blue-500 hover:bg-blue-600' },
                        trial: { label: 'Prueba', className: 'bg-purple-500 hover:bg-purple-600' },
                        injured: { label: 'Lesionado', className: 'bg-orange-500 hover:bg-orange-600' },
                        inactive: { label: 'Baja', className: 'bg-slate-500 hover:bg-slate-600' },
                      };
                      
                      const config = statusConfig[client.status as keyof typeof statusConfig] || statusConfig.active;
                      
                      return (
                        <Badge className={config.className}>
                          {config.label}
                        </Badge>
                      );
                    })()}
                  </TableCell>
                  <TableCell>{getPackageName(client.package_id)}</TableCell>
                  <TableCell>{formatDate(client.registration_date)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-4 text-muted-foreground"
                >
                  No se encontraron alumnos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
