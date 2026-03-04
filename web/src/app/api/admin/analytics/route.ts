import { NextResponse } from "next/server";
import { getSearchLogs } from "@/lib/analytics";

export async function GET() {
  const logs = getSearchLogs();
  return NextResponse.json({ logs });
}
