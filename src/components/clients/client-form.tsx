'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  clientSchema,
  type ClientFormValues,
} from '@/schemas/clientSchemas/clientSchema';

interface ClientFormProps {
  defaultValues?: Partial<ClientFormValues>;
  onSubmit: (data: ClientFormValues) => void;
  onCancel: () => void;
}

export function ClientForm({
  defaultValues,
  onSubmit,
  onCancel,
}: ClientFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('/api/packages');
        const data = await res.json();
        if (data.packages) {
          setPackages(data.packages);
        }
      } catch (err) {
        console.error('Error loading packages', err);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los planes disponibles.',
          variant: 'destructive',
        });
      }
    };
    fetchPackages();
  }, [toast]);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      phone: defaultValues?.phone || '',
      registration_date: defaultValues?.registration_date
        ? new Date(defaultValues.registration_date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      status: (defaultValues?.status as any) || 'active',
      package_id: defaultValues?.package_id || '',
    },
  });

  const handleSubmit = async (data: ClientFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast({
        title: 'Alumno guardado',
        description:
          'La información del alumno ha sido guardada correctamente.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al guardar la información del alumno.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="Nombre completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono (WhatsApp)</FormLabel>
              <FormControl>
                <Input
                  placeholder="+34 123 456 789"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="registration_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de inscripción</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split('T')[0]
                      : ''
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estatus</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el estatus" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Activo (Alumno al corriente)
                    </span>
                  </SelectItem>
                  <SelectItem value="pending_payment">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-yellow-500" />
                      Pago pendiente
                    </span>
                  </SelectItem>
                  <SelectItem value="suspended">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      Suspendido (Pago atrasado)
                    </span>
                  </SelectItem>
                  <SelectItem value="paused">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      En pausa (Congelado)
                    </span>
                  </SelectItem>
                  <SelectItem value="trial">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-purple-500" />
                      Clase de prueba
                    </span>
                  </SelectItem>
                  <SelectItem value="injured">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500" />
                      Lesionado
                    </span>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-500" />
                      Baja definitiva
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="package_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan contratado</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || ''}
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un plan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg.id} value={String(pkg.id)}>
                      {pkg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            type="button"
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
