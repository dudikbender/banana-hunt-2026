"use client";

import { useEffect, useState } from "react";

import { HOME_LOCATION_OPTIONS } from "@/data/locations";
import { useHomeStore } from "@/stores/home-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const ADMIN_SESSION_KEY = "banana-hunt-admin-auth";

export function AdminPanel() {
  const applyHomeOptionId = useHomeStore((state) => state.applyHomeOptionId);
  const currentHomeLocationOptionId = useHomeStore(
    (state) => state.homeLocationOptionId,
  );

  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState(
    currentHomeLocationOptionId,
  );
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthenticated(sessionStorage.getItem(ADMIN_SESSION_KEY) === "true");
  }, []);

  useEffect(() => {
    if (!authenticated) {
      setLoading(false);
      return;
    }

    void (async () => {
      try {
        const response = await fetch("/api/admin/home-location");
        if (!response.ok) {
          throw new Error("Failed to load home location.");
        }

        const data = (await response.json()) as { homeLocationId: string };
        setSelectedOptionId(data.homeLocationId);
        applyHomeOptionId(data.homeLocationId);
      } catch {
        setSaveError("Could not load the current home location.");
      } finally {
        setLoading(false);
      }
    })();
  }, [authenticated, applyHomeOptionId]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null);

    const response = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.status === 401) {
      setLoginError("Incorrect password.");
      return;
    }

    if (!response.ok) {
      setLoginError("Could not verify password.");
      return;
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    setAuthenticated(true);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/home-location", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          homeLocationId: selectedOptionId,
        }),
      });

      if (response.status === 401) {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setAuthenticated(false);
        setSaveError("Session expired. Please sign in again.");
        return;
      }

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Could not save home location.");
      }

      applyHomeOptionId(selectedOptionId);
      setSaveSuccess(true);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Could not save home location.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!authenticated) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin</CardTitle>
          <CardDescription>
            Enter the admin password to manage the hunt home location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {loginError && (
              <p className="text-sm text-destructive" role="alert">
                {loginError}
              </p>
            )}

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Home location</CardTitle>
        <CardDescription>
          Choose where the house marker and &ldquo;Back to Start&rdquo; point on
          the map. Changes apply for everyone on their next page load.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <form className="space-y-4" onSubmit={handleSave}>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Home base</legend>
              <div className="space-y-2">
                {HOME_LOCATION_OPTIONS.map((option) => {
                  const selected = selectedOptionId === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedOptionId(option.id)}
                      className={cn(
                        "flex w-full rounded-lg border px-4 py-3 text-left transition-colors",
                        selected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40 hover:bg-muted/60",
                      )}
                      aria-pressed={selected}
                    >
                      <div>
                        <p className="font-medium">{option.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="space-y-2">
              <Label htmlFor="admin-save-password">Password</Label>
              <Input
                id="admin-save-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {saveError && (
              <p className="text-sm text-destructive" role="alert">
                {saveError}
              </p>
            )}

            {saveSuccess && (
              <p className="text-sm text-primary" role="status">
                Home location saved.
              </p>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Saving…" : "Save home location"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
