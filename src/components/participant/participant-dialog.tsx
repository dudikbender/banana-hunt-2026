"use client";

import { useEffect, useState } from "react";

import { subscribeParticipant } from "@/lib/subscribe-participant";
import {
  selectHasJoined,
  useParticipantStore,
} from "@/stores/participant-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ParticipantDialog() {
  const hasJoined = useParticipantStore(selectHasJoined);
  const register = useParticipantStore((state) => state.register);

  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Please enter your name to join the hunt.");
      return;
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    const participant = {
      name: trimmedName,
      email: trimmedEmail || undefined,
    };

    try {
      await subscribeParticipant(participant);
      register(participant);
    } catch (error) {
      console.error("Mailing list subscription failed:", error);
      register(participant);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={!hasJoined}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Boston Banana Hunt 2026: Going Yard 🍌</DialogTitle>
          <DialogDescription>
            What kind of person hunts bananas? Peel back some layers to join the
            hunt.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="participant-name">Your name (or alias)</Label>
            <Input
              id="participant-name"
              name="name"
              autoComplete="name"
              placeholder="John Banana, Esq."
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(error && !name.trim())}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="participant-email">Your email (optional)</Label>
            <Input
              id="participant-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="bananas@beendrinking.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <DialogFooter className="border-t-0 bg-transparent p-2 sm:justify-stretch">
            <Button type="submit" className="w-full" disabled={submitting}>
              <span className="text-base">
                {submitting ? "Joining..." : "🍌 Happy hunting!"}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
