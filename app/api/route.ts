"use server";
import { NextResponse } from "next/server";
import { supabase } from "@/util/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase.from("daily_coin_stats").select();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
