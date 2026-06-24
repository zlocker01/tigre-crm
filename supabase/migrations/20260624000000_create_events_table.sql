CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_id uuid NOT NULL REFERENCES public.landing_pages(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_landing_id_idx
  ON public.events (landing_id);

CREATE INDEX IF NOT EXISTS events_created_at_idx
  ON public.events (created_at DESC);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'events'
      AND policyname = 'Enable read access for all users'
  ) THEN
    CREATE POLICY "Enable read access for all users"
      ON public.events
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'events'
      AND policyname = 'Enable insert for admin role users only'
  ) THEN
    CREATE POLICY "Enable insert for admin role users only"
      ON public.events
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.users users
          WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'events'
      AND policyname = 'Enable update for admin role users only'
  ) THEN
    CREATE POLICY "Enable update for admin role users only"
      ON public.events
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.users users
          WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.users users
          WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'events'
      AND policyname = 'Enable delete for admin role users only'
  ) THEN
    CREATE POLICY "Enable delete for admin role users only"
      ON public.events
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.users users
          WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
      );
  END IF;
END $$;
