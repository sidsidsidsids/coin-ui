import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/util/supabase";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const coin = url.pathname.split("/").pop();
    const { data, error } = await supabase
      .from("historical_coin_stats")
      .select()
      .eq("name_code", coin)
      .order("candle_date", { ascending: false })
      .limit(100);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
