'use client';

import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Client } from '@/interfaces/client/Client';
import { Badge } from '@/components/ui/badge';

export function TrialClassNotifications() {
  const [notifications, setNotifications] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const fetchNotifications = async () => {
    try {
      // Don't set loading to true on subsequent fetches to avoid flickering
      if (notifications.length === 0) setLoading(true);

      const response = await fetch('/api/notifications/trial-classes');
      if (response.ok) {
        const data = await response.json();
        const newNotifications: Client[] = data.clients || [];

        setNotifications(newNotifications);

        // Check against localStorage to see if the latest notification has been seen
        if (newNotifications.length > 0) {
          const latestId = newNotifications[0].id;
          const lastSeenId =
            typeof window !== 'undefined'
              ? localStorage.getItem('lastSeenTrialClassId')
              : null;

          if (latestId !== lastSeenId) {
            setHasUnread(true);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setHasUnread(false);
      // Mark the latest notification as seen in localStorage
      if (notifications.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('lastSeenTrialClassId', notifications[0].id);
        }
      }
      fetchNotifications(); // Refresh on open
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600 animate-pulse" />
          )}
          <span className="sr-only">Notificaciones</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-semibold">Clases de Prueba</h4>
          <Badge variant="secondary" className="text-xs">
            {notifications.length} recientes
          </Badge>
        </div>
        <ScrollArea className="h-[300px]">
          {loading && notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Cargando...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No hay clases de prueba recientes.
            </div>
          ) : (
            <div className="grid gap-1">
              {notifications.map((client) => (
                <div
                  key={client.id}
                  className="flex flex-col gap-1 border-b p-3 last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{client.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {client.registration_date
                        ? format(
                            new Date(client.registration_date),
                            'dd MMM HH:mm',
                            {
                              locale: es,
                            },
                          )
                        : ''}
                    </span>
                  </div>
                  {client.phone && (
                    <div className="text-xs text-muted-foreground">
                      Tel: {client.phone}
                    </div>
                  )}
                  {client.notes && (
                    <div className="mt-1 text-xs bg-secondary/50 p-2 rounded-md">
                      {client.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
