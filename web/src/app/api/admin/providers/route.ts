import { NextRequest, NextResponse } from "next/server";
import {
  getProviderStatus,
  setProviderEnabled,
} from "@/lib/provider-registry";

export async function GET() {
  const status = getProviderStatus();
  return NextResponse.json({ providers: status });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, enabled } = body;
  if (typeof id !== "string" || typeof enabled !== "boolean") {
    return NextResponse.json(
      { error: "Missing id or enabled" },
      { status: 400 }
    );
  }
  setProviderEnabled(id, enabled);
  return NextResponse.json({ ok: true });
}
