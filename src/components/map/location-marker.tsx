"use client";

import { useState } from "react";
import { Banana, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useHuntStore } from "@/stores/hunt-store";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: {
    container: "size-8",
    icon: "size-4",
  },
  md: {
    container: "size-11",
    icon: "size-6",
  },
  lg: {
    container: "size-14",
    icon: "size-8",
  },
} as const;

export interface LocationMarkerProps {
  locationId?: string;
  selected?: boolean;
  size?: keyof typeof sizeClasses;
  className?: string;
  label?: string;
  icon?: "banana" | "house";
  peelable?: boolean;
  onClick?: () => void;
}

export function LocationMarker({
  locationId,
  selected = false,
  size = "md",
  className,
  label = "Location marker",
  icon = "banana",
  peelable = false,
  onClick,
}: LocationMarkerProps) {
  const [popupOpen, setPopupOpen] = useState(false);
  const visited = useHuntStore((state) =>
    locationId ? state.isVisited(locationId) : false,
  );
  const markVisited = useHuntStore((state) => state.markVisited);
  const markUnvisited = useHuntStore((state) => state.markUnvisited);

  const sizes = sizeClasses[size];
  const isBanana = icon === "banana";
  const showPeelPopup = peelable && isBanana && locationId;

  const sharedClasses = cn(
    "flex items-center justify-center rounded-full border-2 border-white bg-white shadow-md transition-colors transition-transform",
    isBanana && (visited ? "text-amber-800" : "text-yellow-500"),
    !isBanana && "text-primary",
    sizes.container,
    selected && "scale-110 ring-2 ring-primary ring-offset-2",
    (onClick || showPeelPopup) && "cursor-pointer hover:scale-105",
    className,
  );

  const Icon = isBanana ? Banana : Home;
  const iconClasses = cn(
    sizes.icon,
    "transition-transform duration-300",
    isBanana && visited && "rotate-180",
  );

  const handleMarkerClick = () => {
    onClick?.();
    if (showPeelPopup) {
      setPopupOpen((open) => !open);
    }
  };

  const handlePeelAction = () => {
    if (!locationId) {
      return;
    }

    if (visited) {
      markUnvisited(locationId);
    } else {
      markVisited(locationId);
    }

    setPopupOpen(false);
  };

  const markerButton = (
    <button
      type="button"
      aria-label={label}
      aria-expanded={showPeelPopup ? popupOpen : undefined}
      onClick={handleMarkerClick}
      className={sharedClasses}
    >
      <Icon className={iconClasses} aria-hidden strokeWidth={2.25} />
    </button>
  );

  const markerDisplay =
    onClick || showPeelPopup ? (
      markerButton
    ) : (
      <div className={sharedClasses} aria-label={label}>
        <Icon className={iconClasses} aria-hidden strokeWidth={2.25} />
      </div>
    );

  if (!showPeelPopup) {
    return markerDisplay;
  }

  return (
    <div className="relative">
      {markerDisplay}
      {popupOpen && (
        <div className="absolute bottom-full left-1/2 z-20 mb-2 w-36 -translate-x-1/2 rounded-lg border border-border bg-background p-2 shadow-lg">
          <p className="mb-2 truncate text-xl text-center font-medium text-foreground">
            {label}
          </p>
          <Button
            type="button"
            size="lg"
            variant={visited ? "outline" : "default"}
            className="w-full text-base"
            onClick={handlePeelAction}
          >
            {visited ? "Reset Banana" : "Unpeel Banana"}
          </Button>
        </div>
      )}
    </div>
  );
}
