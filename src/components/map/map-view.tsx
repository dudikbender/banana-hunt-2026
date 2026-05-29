"use client";

import dynamic from "next/dynamic";

import type { MapboxMapProps } from "@/components/map/mapbox-map";

const CUSTOM_MAP_STYLE = "mapbox://styles/mapbox/standard";

const MapboxMap = dynamic<MapboxMapProps>(
  () => import("@/components/map/mapbox-map").then((mod) => mod.MapboxMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted/30">
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    ),
  },
);

export function MapView() {
  return <MapboxMap styleUrl={CUSTOM_MAP_STYLE} />;
}
