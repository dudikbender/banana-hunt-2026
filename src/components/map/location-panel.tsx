"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

import { HUNT_LOCATIONS } from "@/data/locations";
import { LocationMarker } from "@/components/map/location-marker";
import { useMapStore } from "@/stores/map-store";
import { selectUnvisitedCount, useHuntStore } from "@/stores/hunt-store";
import {
  selectParticipantName,
  useParticipantStore,
} from "@/stores/participant-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function LocationRow({
  location,
  isSelected,
  onSelect,
}: {
  location: (typeof HUNT_LOCATIONS)[number];
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors",
          isSelected
            ? "border-primary bg-primary/5"
            : "border-transparent hover:border-border hover:bg-muted/60",
        )}
      >
        <LocationMarker
          locationId={location.id}
          label={location.name}
          icon="banana"
          selected={isSelected}
          size="sm"
        />
        <div className="min-w-0">
          <p className="text-base font-medium">{location.name}</p>
          <p className="text-base text-muted-foreground">
            {location.description}
          </p>
        </div>
      </button>
    </li>
  );
}

export function LocationPanel() {
  const [collapsed, setCollapsed] = useState(true);
  const { selectedLocationId, selectLocation, resetViewport } = useMapStore();
  const unvisitedCount = useHuntStore(selectUnvisitedCount);
  const resetVisited = useHuntStore((state) => state.resetVisited);
  const participantName = useParticipantStore(selectParticipantName);
  const clearParticipant = useParticipantStore(
    (state) => state.clearParticipant,
  );
  const firstName = participantName?.split(" ")[0];

  const toggleCollapsed = () => setCollapsed((open) => !open);

  const handleLogOut = () => {
    clearParticipant();
    resetVisited();
    resetViewport();
    setCollapsed(true);
  };

  return (
    <Card
      className={cn(
        "pointer-events-auto absolute bottom-4 left-1/2 z-10 flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 flex-col border-border/60 bg-background/90 shadow-lg backdrop-blur-sm",
        !collapsed && "top-4",
      )}
    >
      <CardHeader className="shrink-0 pb-3">
        <div className="flex items-start gap-2">
          <button
            type="button"
            className="min-w-0 flex-1 text-left"
            aria-expanded={!collapsed}
            onClick={toggleCollapsed}
          >
            <CardTitle>🍌 Banana Hunt 2026 🍌</CardTitle>
            <CardDescription>
              {unvisitedCount === 0
                ? firstName
                  ? `${firstName}, you checked every spot!`
                  : "All locations might have the banana!"
                : firstName
                  ? `${firstName}, ${unvisitedCount} location${unvisitedCount === 1 ? "" : "s"} left to check!`
                  : `${unvisitedCount} location${unvisitedCount === 1 ? "" : "s"} left to check!`}
            </CardDescription>
          </button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            aria-expanded={!collapsed}
            aria-label={
              collapsed ? "Expand location list" : "Collapse location list"
            }
            onClick={toggleCollapsed}
          >
            <ChevronUp
              className={cn(
                "size-4 transition-transform duration-200",
                !collapsed && "rotate-180",
              )}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-3",
          collapsed && "hidden",
        )}
      >
        <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {HUNT_LOCATIONS.map((location) => (
            <LocationRow
              key={location.id}
              location={location}
              isSelected={selectedLocationId === location.id}
              onSelect={() => {
                setCollapsed(true);
                selectLocation(location);
              }}
            />
          ))}
        </ul>
        <div className="flex shrink-0 flex-col gap-2">
          <Button variant="outline" className="w-full" onClick={resetViewport}>
            Back to Start
          </Button>
          <Button variant="ghost" className="w-full" onClick={handleLogOut}>
            Log out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
