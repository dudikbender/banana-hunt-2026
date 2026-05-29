"use client";

import { Navigation } from "lucide-react";

export function UserLocationMarker() {
  return (
    <div
      className="relative flex size-8 items-center justify-center"
      aria-label="Your location"
    >
      <span className="absolute size-8 animate-ping rounded-full bg-blue-500/30" />
      <div className="relative flex size-8 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-md">
        <Navigation
          size={10}
          className="fill-white text-white"
          aria-hidden
          strokeWidth={2.25}
        />
      </div>
    </div>
  );
}
