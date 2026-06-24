import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const sql = `
      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS public.events (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          landing_id UUID REFERENCES public.landing_pages(id) ON DELETE CASCADE NOT NULL,
          image_url TEXT NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS events_landing_id_idx
          ON public.events (landing_id);

        CREATE INDEX IF NOT EXISTS events_created_at_idx
          ON public.events (created_at DESC);

        -- Habilitar RLS
        ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

        -- Policies
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'events' AND policyname = 'Enable read access for all users') THEN
            CREATE POLICY "Enable read access for all users" ON public.events FOR SELECT TO public USING (true);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'events' AND policyname = 'Enable insert for admin role users only') THEN
            CREATE POLICY "Enable insert for admin role users only" ON public.events FOR INSERT TO authenticated WITH CHECK (
              EXISTS (
                SELECT 1
                FROM public.users users
                WHERE users.id = auth.uid()
                  AND users.role = 'admin'
              )
            );
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'events' AND policyname = 'Enable update for admin role users only') THEN
            CREATE POLICY "Enable update for admin role users only" ON public.events FOR UPDATE TO authenticated USING (
              EXISTS (
                SELECT 1
                FROM public.users users
                WHERE users.id = auth.uid()
                  AND users.role = 'admin'
              )
            ) WITH CHECK (
              EXISTS (
                SELECT 1
                FROM public.users users
                WHERE users.id = auth.uid()
                  AND users.role = 'admin'
              )
            );
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'events' AND policyname = 'Enable delete for admin role users only') THEN
            CREATE POLICY "Enable delete for admin role users only" ON public.events FOR DELETE TO authenticated USING (
              EXISTS (
                SELECT 1
                FROM public.users users
                WHERE users.id = auth.uid()
                  AND users.role = 'admin'
              )
            );
        END IF;

      END $$;
    `;

    const { error } = await supabase.rpc('exec_sql', { query: sql });

    if (error) {
      console.error('Error executing migration SQL:', error);
      // Fallback: Return the SQL so the user can run it manually if RPC fails
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          sql_to_run: sql,
          details:
            "RPC 'exec_sql' failed. Please run the provided SQL in Supabase SQL Editor.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Events table created successfully.',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    );
  }
}
