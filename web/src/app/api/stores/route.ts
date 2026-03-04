import { NextResponse } from "next/server";
import { getEnabledProviders } from "@/lib/provider-registry";

export async function GET() {
  const stores = getEnabledProviders().map((p) => ({
    id: p.config.id,
    name: p.config.name,
  }));
  return NextResponse.json({ stores });
}
