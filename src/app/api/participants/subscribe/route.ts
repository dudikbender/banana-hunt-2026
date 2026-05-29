import { NextResponse } from "next/server";

import { addParticipantToResendAudience } from "@/lib/resend-audience";

function parseBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request." };
  }

  const { name, email } = body as { name?: unknown; email?: unknown };

  if (typeof name !== "string" || !name.trim()) {
    return { error: "Name is required." };
  }

  const trimmedEmail =
    typeof email === "string" && email.trim() ? email.trim() : undefined;

  if (
    trimmedEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
  ) {
    return { error: "Please enter a valid email address." };
  }

  return {
    participant: {
      name: name.trim(),
      email: trimmedEmail,
    },
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseBody(body);

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await addParticipantToResendAudience(parsed.participant);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to subscribe participant:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to add participant to audience.",
      },
      { status: 500 },
    );
  }
}
