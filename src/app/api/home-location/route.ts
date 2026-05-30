import { NextResponse } from "next/server";

import { resolveHomeLocation } from "@/data/locations";
import { readHomeConfig } from "@/lib/home-config-server";

export async function GET() {
  const config = readHomeConfig();
  const homeLocation = resolveHomeLocation(config.homeLocationId);

  return NextResponse.json({
    homeLocationId: config.homeLocationId,
    homeLocation,
  });
}
