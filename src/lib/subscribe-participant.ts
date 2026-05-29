import type { Participant } from "@/stores/participant-store";

export async function subscribeParticipant(
  participant: Participant,
): Promise<{ ok: boolean; skipped?: boolean }> {
  const response = await fetch("/api/participants/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(participant),
  });

  const data = (await response.json().catch(() => null)) as {
    ok?: boolean;
    skipped?: boolean;
    error?: string;
  } | null;

  if (!response.ok) {
    throw new Error(data?.error ?? "Failed to subscribe participant.");
  }

  return { ok: true, skipped: data?.skipped };
}
