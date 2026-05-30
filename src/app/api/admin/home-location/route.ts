import { NextResponse } from "next/server";

import { isHomeLocationOptionId } from "@/data/locations";
import { verifyAdminPassword } from "@/lib/admin-auth";
import { readHomeConfig, writeHomeConfig } from "@/lib/home-config-server";

export async function GET() {
  const config = readHomeConfig();

  return NextResponse.json({
    homeLocationId: config.homeLocationId,
  });
}

export async function PUT(request: Request) {
  let body: { password?: string; homeLocationId?: string };

  try {
    body = (await request.json()) as { password?: string; homeLocationId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.password || !verifyAdminPassword(body.password)) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  if (!body.homeLocationId || !isHomeLocationOptionId(body.homeLocationId)) {
    return NextResponse.json(
      { error: "Invalid home location option." },
      { status: 400 },
    );
  }

  try {
    writeHomeConfig({ homeLocationId: body.homeLocationId });
  } catch (error) {
    console.error("Failed to write home config:", error);
    return NextResponse.json(
      { error: "Could not save home location. Check server write permissions." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    homeLocationId: body.homeLocationId,
  });
}
