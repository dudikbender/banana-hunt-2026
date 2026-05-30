"use client";

import { useEffect } from "react";

import { useHomeStore } from "@/stores/home-store";
import { useMapStore } from "@/stores/map-store";

export function HomeHydrator() {
  const hydrateFromServer = useHomeStore((state) => state.hydrateFromServer);

  useEffect(() => {
    void (async () => {
      await hydrateFromServer();

      const { homeLocation } = useHomeStore.getState();
      const { selectedLocationId } = useMapStore.getState();

      if (selectedLocationId === homeLocation.id) {
        useMapStore.getState().setViewport({
          longitude: homeLocation.longitude,
          latitude: homeLocation.latitude,
          zoom: 14,
        });
      }
    })();
  }, [hydrateFromServer]);

  return null;
}
