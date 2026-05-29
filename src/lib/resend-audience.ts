import { Resend } from "resend";

import type { Participant } from "@/stores/participant-store";

function parseName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? name.trim();
  const lastName = parts.slice(1).join(" ");

  return {
    firstName,
    lastName: lastName || undefined,
  };
}

function getResendSegmentId() {
  return process.env.RESEND_SEGMENT_ID ?? process.env.RESEND_AUDIENCE_ID;
}

function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && getResendSegmentId());
}

export async function addParticipantToResendAudience(
  participant: Participant,
): Promise<{ ok: true; skipped: boolean }> {
  if (!participant.email) {
    return { ok: true, skipped: true };
  }

  if (!isResendConfigured()) {
    console.warn(
      "Resend is not configured (RESEND_API_KEY + RESEND_SEGMENT_ID). Skipping audience subscription.",
    );
    return { ok: true, skipped: true };
  }

  const resend = new Resend(process.env.RESEND_API_KEY!);
  const segmentId = getResendSegmentId()!;
  const { firstName, lastName } = parseName(participant.name);
  const email = participant.email.trim().toLowerCase();

  const { error: createError } = await resend.contacts.create({
    email,
    firstName,
    lastName,
    unsubscribed: false,
    segments: [{ id: segmentId }],
  });

  if (!createError) {
    return { ok: true, skipped: false };
  }

  const { error: segmentError } = await resend.contacts.segments.add({
    email,
    segmentId,
  });

  if (segmentError) {
    throw new Error(segmentError.message);
  }

  return { ok: true, skipped: false };
}
