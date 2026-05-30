import { NextResponse } from "next/server";

import { verifyAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  let body: { password?: string };

  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.password || !verifyAdminPassword(body.password)) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
