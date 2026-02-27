import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const sql = `
      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS events (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          landing_id UUID REFERENCES landing_pages(id) ON DELETE CASCADE NOT NULL,
          image_url TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Habilitar RLS
        ALTER TABLE events ENABLE ROW LEVEL SECURITY;

        -- Policies
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Enable read access for all users') THEN
            CREATE POLICY "Enable read access for all users" ON events FOR SELECT USING (true);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Enable insert for authenticated users only') THEN
            CREATE POLICY "Enable insert for authenticated users only" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Enable delete for authenticated users only') THEN
            CREATE POLICY "Enable delete for authenticated users only" ON events FOR DELETE USING (auth.role() = 'authenticated');
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
