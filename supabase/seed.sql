-- Minimal demo seed for fresh clones.
-- Keeps the project reproducible without depending on manual local data.

INSERT INTO public.inventory (
  user_id,
  name,
  item_name,
  category,
  description,
  item_type,
  quantity,
  unit,
  minimum_stock,
  location,
  status,
  unit_cost,
  estimated_price,
  created_at,
  updated_at,
  last_updated
)
SELECT
  NULL,
  seed.name,
  seed.name,
  seed.category,
  seed.description,
  seed.item_type,
  seed.quantity,
  seed.unit,
  seed.minimum_stock,
  seed.location,
  seed.status,
  seed.unit_cost,
  seed.estimated_price,
  now(),
  now(),
  now()
FROM (
  VALUES
    (
      'Kimono Jiu-Jitsu Adulto Blanco',
      'Uniformes',
      'Kimono de entrenamiento para alumnos adultos.',
      'apparel',
      8,
      'pieza',
      2,
      'Bodega principal',
      'available',
      850,
      1100
    ),
    (
      'Spray Desinfectante para Tatami',
      'Limpieza',
      'Producto de limpieza para el area de entrenamiento.',
      'consumable',
      12,
      'botella',
      4,
      'Cuarto de limpieza',
      'available',
      95,
      140
    ),
    (
      'Cuadros de Tatami Profesional de Competicion',
      'Tatami',
      'Modulo de tatami para clases y eventos.',
      'equipment',
      60,
      'pieza',
      20,
      'Area de entrenamiento',
      'available',
      420,
      650
    )
) AS seed(
  name,
  category,
  description,
  item_type,
  quantity,
  unit,
  minimum_stock,
  location,
  status,
  unit_cost,
  estimated_price
)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.inventory i
  WHERE COALESCE(i.name, i.item_name) = seed.name
);
