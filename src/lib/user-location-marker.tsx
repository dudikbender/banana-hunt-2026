import type { Root } from "react-dom/client";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";

import { UserLocationMarker } from "@/components/map/user-location-marker";

export interface MountedUserLocationMarker {
  marker: mapboxgl.Marker;
  root: Root;
}

export function mountUserLocationMarker(
  map: mapboxgl.Map,
  longitude: number,
  latitude: number,
): MountedUserLocationMarker {
  const element = document.createElement("div");
  const root = createRoot(element);

  root.render(<UserLocationMarker />);

  const marker = new mapboxgl.Marker({ element, anchor: "center" })
    .setLngLat([longitude, latitude])
    .addTo(map);

  return { marker, root };
}

export function updateUserLocationMarker(
  mounted: MountedUserLocationMarker,
  longitude: number,
  latitude: number,
) {
  mounted.marker.setLngLat([longitude, latitude]);
}

export function unmountUserLocationMarker(mounted: MountedUserLocationMarker) {
  mounted.marker.remove();
  queueMicrotask(() => {
    mounted.root.unmount();
  });
}
