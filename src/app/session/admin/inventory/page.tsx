'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Package, Plus, Search, Trash2, Pencil } from 'lucide-react';
import { DeleteDialog } from '@/components/ui/DeleteDialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type {
  InventoryItem,
  InventoryItemStatus,
  InventoryItemType,
} from '@/interfaces/inventory/InventoryItem';

type InventoryFormState = {
  id?: number;
  name: string;
  category: string;
  item_type: InventoryItemType | '';
  quantity: number;
  unit?: string;
  minimum_stock?: number;
  expiration_date?: string;
  location?: string;
  status: InventoryItemStatus;
};

const itemTypeLabels: Record<InventoryItemType, string> = {
  consumable: 'Consumible',
  instrument: 'Herramienta',
  equipment: 'Equipo',
  apparel: 'Indumentaria',
};

const itemStatusLabels: Record<InventoryItemStatus, string> = {
  available: 'Disponible',
  out_of_stock: 'Agotado',
  in_use: 'En uso',
  maintenance: 'En mantenimiento',
  expired: 'Caducado',
};

const inventorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'El nombre es obligatorio'),
  category: z.string().min(1, 'La categoría es obligatoria'),
  item_type: z
    .union([
      z.enum(['consumable', 'instrument', 'equipment', 'apparel']),
      z.literal(''),
    ])
    .refine((v) => v !== '', {
      message: 'Selecciona un tipo de producto válido',
    }),
  quantity: z
    .number()
    .min(0, 'La cantidad no puede ser negativa')
    .max(1_000_000, 'La cantidad es demasiado grande'),
  unit: z.string().max(50).optional(),
  minimum_stock: z
    .number()
    .min(0, 'El stock mínimo no puede ser negativo')
    .max(1_000_000, 'El stock mínimo es demasiado grande')
    .optional(),
  expiration_date: z.string().optional(),
  location: z.string().max(100).optional(),
  status: z.enum(
    ['available', 'out_of_stock', 'in_use', 'maintenance', 'expired'],
    {
      message: 'Selecciona un estado válido',
    },
  ),
});

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<InventoryFormState>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: '',
      category: '',
      item_type: '',
      quantity: 0,
      unit: '',
      minimum_stock: 0,
      expiration_date: '',
      location: '',
      status: 'available',
    },
  });

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inventory');
      const json = await res.json();
      if (json.success) {
        setItems(json.data as InventoryItem[]);
      } else {
        toast({
          title: 'Error al cargar inventario',
          description: json.error || 'No se pudo obtener el inventario.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error al cargar inventario',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo obtener el inventario.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openCreateDialog = () => {
    form.reset({
      id: undefined,
      name: '',
      category: '',
      item_type: '',
      quantity: 0,
      unit: '',
      minimum_stock: 0,
      expiration_date: '',
      location: '',
      status: 'available',
    });
    setDialogOpen(true);
  };

  const openEditDialog = (item: InventoryItem) => {
    form.reset({
      id: item.id,
      name: item.name,
      category: item.category,
      item_type: item.item_type,
      quantity: item.quantity,
      unit: item.unit || '',
      minimum_stock: item.minimum_stock ?? 0,
      expiration_date: item.expiration_date
        ? new Date(item.expiration_date).toISOString().split('T')[0]
        : '',
      location: item.location || '',
      status: item.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (values: InventoryFormState) => {
    setSaving(true);
    try {
      const payload = {
        name: values.name,
        category: values.category,
        item_type: values.item_type,
        quantity: Number(values.quantity) || 0,
        unit: values.unit || undefined,
        minimum_stock: Number(values.minimum_stock) || 0,
        expiration_date: values.expiration_date || undefined,
        location: values.location || undefined,
        status: (values.status || 'available') as InventoryItemStatus,
      };

      const res = await fetch(
        values.id ? `/api/inventory/${values.id}` : '/api/inventory',
        {
          method: values.id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast({
          title: 'Error al guardar producto',
          description:
            json.error ||
            (values.id
              ? 'No se pudo actualizar el producto.'
              : 'No se pudo crear el producto.'),
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: values.id ? 'Producto actualizado' : 'Producto creado',
        description: values.id
          ? 'El producto se actualizó correctamente.'
          : 'El producto se creó correctamente.',
        variant: 'success',
      });

      setDialogOpen(false);
      await loadItems();
    } catch (error) {
      toast({
        title: 'Error al guardar producto',
        description:
          error instanceof Error
            ? error.message
            : 'Ocurrió un error inesperado al guardar.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast({
          title: 'Error al eliminar producto',
          description:
            json.error || 'No se pudo eliminar el producto seleccionado.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Producto eliminado',
        description: 'El producto ha sido eliminado correctamente.',
        variant: 'success',
      });

      await loadItems();
    } catch (error) {
      toast({
        title: 'Error al eliminar producto',
        description:
          error instanceof Error
            ? error.message
            : 'Ocurrió un error inesperado al eliminar.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      (item.location || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">
            Gestiona los productos e insumos de la barberia.
          </p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
          <Button variant="outline" onClick={() => setHelpOpen(true)}>
            ¿Cómo usar esta sección?
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Producto
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría / Tipo</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Caducidad</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Cargando inventario...
                    </TableCell>
                  </TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Package className="mb-2 h-8 w-8 opacity-50" />
                        <p>No hay productos registrados</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.category} /{' '}
                        {itemTypeLabels[item.item_type] || item.item_type}
                      </TableCell>
                      <TableCell>{item.location || '-'}</TableCell>
                      <TableCell>
                        {item.expiration_date
                          ? new Date(item.expiration_date).toLocaleDateString(
                              'es-MX',
                            )
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell className="text-center">
                        {itemStatusLabels[item.status] || item.status}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <DeleteDialog
                            onDelete={() => handleDelete(item.id)}
                            buttonText=""
                            title="¿Eliminar producto?"
                            description={`Esta acción no se puede deshacer. Esto eliminará permanentemente "${item.name}" del inventario.`}
                            cancelText="Cancelar"
                            confirmText={
                              deletingId === item.id
                                ? 'Eliminando...'
                                : 'Eliminar'
                            }
                            variant="destructive"
                            size="icon"
                            buttonClassName="h-8 w-8 p-0 flex items-center justify-center"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-full max-w-[480px] sm:max-w-[640px] md:max-w-[720px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {form.watch('id') ? 'Editar producto' : 'Agregar producto'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              className="grid gap-4 py-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input id="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <FormControl>
                        <Input id="category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="item_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consumable">
                              Consumible
                            </SelectItem>
                            <SelectItem value="instrument">
                              Herramienta
                            </SelectItem>
                            <SelectItem value="equipment">Equipo</SelectItem>
                            <SelectItem value="apparel">
                              Indumentaria
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">
                              Disponible
                            </SelectItem>
                            <SelectItem value="out_of_stock">
                              Agotado
                            </SelectItem>
                            <SelectItem value="in_use">En uso</SelectItem>
                            <SelectItem value="maintenance">
                              En mantenimiento
                            </SelectItem>
                            <SelectItem value="expired">Caducado</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                <FormField
                  control={form.control as any}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidad</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minimum_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock mínimo</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación</FormLabel>
                      <FormControl>
                        <Input id="location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiration_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de caducidad</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : form.watch('id') ? (
                    'Guardar cambios'
                  ) : (
                    'Crear producto'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="w-full max-w-[480px] sm:max-w-[640px] md:max-w-[720px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-primary">
              Cómo usar el inventario de la academia
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Esta sección te ayuda a
              <span className="mx-1 font-semibold text-primary">
                registrar y controlar
              </span>
              el material y equipo de JSBJJ MX.
            </p>
            <div className="space-y-1 rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
              <p className="font-semibold text-primary">
                1. Información básica
              </p>
              <p>
                Usa
                <span className="mx-1 font-semibold text-primary">Nombre</span>
                para algo que todo el Equipo reconozca rápidamente.
              </p>
              <p>
                En
                <span className="mx-1 font-semibold text-primary">
                  Categoría
                </span>
                agrupa por tipo de producto, por ejemplo:
                <span className="mx-1 font-medium text-secondary">
                  Kimonos → Indumentaria, Rashguards → Indumentaria, Cintas →
                  Consumible, Tatami → Equipo, Escudos / paos → Equipo
                </span>
                .
              </p>
              <p>
                <span className="font-semibold text-primary">Tipo</span> indica
                si es Consumible, Equipo o Indumentaria según cómo lo uses en tu
                academia.
              </p>
            </div>
            <div className="space-y-1 rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
              <p className="font-semibold text-primary">2. Cantidad y stock</p>
              <p>
                <span className="font-semibold text-primary">Cantidad</span>
                es lo que tienes actualmente en inventario.
              </p>
              <p>
                <span className="font-semibold text-primary">Unidad</span>
                puede ser piezas, cajas, ml, gramos, etc.
              </p>
              <p>
                Usa
                <span className="mx-1 font-semibold text-secondary">
                  Stock mínimo
                </span>
                para que sepas
                <span className="mx-1 font-semibold text-primary">
                  cuándo necesitas reponer
                </span>
                antes de que se acabe.
              </p>
            </div>
            <div className="space-y-1 rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
              <p className="font-semibold text-primary">
                3. Caducidad y ubicación
              </p>
              <p>
                <span className="font-semibold text-destructive">
                  Fecha de caducidad
                </span>
                es importante sobre todo para suplementos, productos de limpieza
                o materiales estériles.
              </p>
              <p>
                En
                <span className="mx-1 font-semibold text-primary">
                  Ubicación
                </span>
                puedes poner dónde se guarda:
                <span className="mx-1 font-medium text-secondary">
                  tatami principal, bodega, recepción, área de limpieza
                </span>
                , etc.
              </p>
            </div>
            <div className="space-y-1 rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
              <p className="font-semibold text-primary">4. Estado</p>
              <p>
                El
                <span className="mx-1 font-semibold text-primary">Estado</span>
                te permite saber si un producto está
                <span className="mx-1 font-medium text-secondary">
                  disponible, agotado, en uso, en mantenimiento o caducado
                </span>
                .
              </p>
            </div>
            <p>
              Cuando termines de llenar los datos mínimos, pulsa{' '}
              <span className="font-semibold text-primary">Guardar</span> para
              registrar o actualizar el producto.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHelpOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
