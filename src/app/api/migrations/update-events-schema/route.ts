import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const sql = `
      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    `;

    const { error } = await supabase.rpc('exec_sql', { query: sql });

    if (error) {
      console.error("Error executing migration SQL:", error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: "Ensure the 'exec_sql' RPC function exists in your database."
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: "Events table schema updated successfully: Added is_active column." 
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 });
  }
}
