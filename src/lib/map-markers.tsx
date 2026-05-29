import type { Root } from "react-dom/client";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";

import type { HuntLocation } from "@/data/locations";
import { LocationMarker } from "@/components/map/location-marker";

export interface MountedLocationMarker {
  locationId: string;
  marker: mapboxgl.Marker;
  root: Root;
}

function renderMarker(
  root: Root,
  location: HuntLocation,
  selected: boolean,
  onSelect: () => void,
) {
  const isBanana = (location.icon ?? "banana") === "banana";

  root.render(
    <LocationMarker
      locationId={location.id}
      label={location.name}
      icon={location.icon ?? "banana"}
      selected={selected}
      peelable={isBanana}
      onClick={onSelect}
    />,
  );
}

export function mountLocationMarkers(
  map: mapboxgl.Map,
  locations: HuntLocation[],
  selectedLocationId: string | null,
  onSelect: (location: HuntLocation) => void,
): MountedLocationMarker[] {
  return locations.map((location) => {
    const element = document.createElement("div");
    const root = createRoot(element);
    const selected = selectedLocationId === location.id;

    renderMarker(root, location, selected, () => onSelect(location));

    const marker = new mapboxgl.Marker({ element, anchor: "bottom" })
      .setLngLat([location.longitude, location.latitude])
      .addTo(map);

    return { locationId: location.id, marker, root };
  });
}

export function updateLocationMarkers(
  mountedMarkers: MountedLocationMarker[],
  locations: HuntLocation[],
  selectedLocationId: string | null,
  onSelect: (location: HuntLocation) => void,
) {
  mountedMarkers.forEach(({ locationId, root }) => {
    const location = locations.find((item) => item.id === locationId);
    if (!location) {
      return;
    }

    renderMarker(
      root,
      location,
      selectedLocationId === locationId,
      () => onSelect(location),
    );
  });
}

/** @deprecated Use updateLocationMarkers */
export const updateLocationMarkerSelection = updateLocationMarkers;

export function unmountLocationMarkers(mountedMarkers: MountedLocationMarker[]) {
  for (const { marker, root } of mountedMarkers) {
    marker.remove();
    queueMicrotask(() => {
      root.unmount();
    });
  }
}
