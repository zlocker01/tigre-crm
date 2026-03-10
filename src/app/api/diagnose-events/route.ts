import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getEvents } from "@/data/events/getEvents";

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Get all events raw data
    const { data: allEvents, error: dataError } = await supabase
      .from("events")

      .select("*");

    // 2. Simulate getEvents for the first event's landing_id (if exists)
    let simulatedGetEvents = null;
    let targetLandingId = null;

    if (allEvents && allEvents.length > 0) {
      targetLandingId = allEvents[0].landing_id;
      simulatedGetEvents = await getEvents(targetLandingId);
    }

    return NextResponse.json({
      diagnosis: {
        events_raw_count: allEvents?.length || 0,
        events_raw_data: allEvents, // This will show the full object including is_active if present
        data_error: dataError?.message || null,
        target_landing_id: targetLandingId,
        simulated_get_events_data: simulatedGetEvents?.data, // Show the processed data
      }
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
