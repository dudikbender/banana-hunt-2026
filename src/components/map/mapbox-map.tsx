"use client";

import { useCallback, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useHomeStore } from "@/stores/home-store";
import {
  mountLocationMarkers,
  unmountLocationMarkers,
  updateLocationMarkers,
  type MountedLocationMarker,
} from "@/lib/map-markers";
import {
  mountUserLocationMarker,
  unmountUserLocationMarker,
  updateUserLocationMarker,
  type MountedUserLocationMarker,
} from "@/lib/user-location-marker";
import { selectUserLocation, useMapStore } from "@/stores/map-store";

const DEFAULT_MAP_STYLE = "mapbox://styles/mapbox/streets-v12";

export interface MapboxMapProps {
  styleUrl?: string;
}

function resolveMapStyle(styleUrl: string, accessToken: string): string {
  const tilesMatch = styleUrl.match(/styles\/v1\/([^/]+)\/([^/]+)\/tiles/);
  if (tilesMatch) {
    return `mapbox://styles/${tilesMatch[1]}/${tilesMatch[2]}`;
  }

  if (styleUrl.startsWith("mapbox://")) {
    return styleUrl;
  }

  if (styleUrl.includes("/styles/v1/") && !styleUrl.includes("access_token")) {
    const separator = styleUrl.includes("?") ? "&" : "?";
    return `${styleUrl}${separator}access_token=${accessToken}`;
  }

  return styleUrl;
}

export function MapboxMap({ styleUrl = DEFAULT_MAP_STYLE }: MapboxMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MountedLocationMarker[]>([]);
  const userMarkerRef = useRef<MountedUserLocationMarker | null>(null);
  const appliedStyleRef = useRef<string | null>(null);
  const {
    longitude,
    latitude,
    zoom,
    selectedLocationId,
    setViewport,
    selectLocation,
    setUserLocation,
    setUserLocationStatus,
  } = useMapStore();
  const userLocation = useMapStore(selectUserLocation);
  const mapLocations = useHomeStore((state) => state.mapLocations);
  const mapLocationsRef = useRef(mapLocations);

  mapLocationsRef.current = mapLocations;

  const setViewportRef = useRef(setViewport);
  const selectLocationRef = useRef(selectLocation);
  const selectedLocationIdRef = useRef(selectedLocationId);
  const userLocationRef = useRef(userLocation);
  const styleUrlRef = useRef(styleUrl);

  setViewportRef.current = setViewport;
  selectLocationRef.current = selectLocation;
  selectedLocationIdRef.current = selectedLocationId;
  userLocationRef.current = userLocation;
  styleUrlRef.current = styleUrl;

  const syncUserMarker = useCallback((map: mapboxgl.Map) => {
    const location = userLocationRef.current;

    if (userMarkerRef.current) {
      unmountUserLocationMarker(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (!location) {
      return;
    }

    userMarkerRef.current = mountUserLocationMarker(
      map,
      location.longitude,
      location.latitude,
    );
  }, []);

  const syncMarkers = useCallback(
    (map: mapboxgl.Map) => {
      unmountLocationMarkers(markersRef.current);
      markersRef.current = mountLocationMarkers(
        map,
        mapLocationsRef.current,
        selectedLocationIdRef.current,
        (location) => selectLocationRef.current(location),
      );
      syncUserMarker(map);
    },
    [syncUserMarker],
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocationStatus("unsupported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setUserLocationStatus("denied");
          return;
        }

        setUserLocationStatus("error");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10_000,
        timeout: 15_000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [setUserLocation, setUserLocationStatus]);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!token || !containerRef.current) {
      return;
    }

    mapboxgl.accessToken = token;

    const resolvedStyle = resolveMapStyle(styleUrlRef.current, token);
    appliedStyleRef.current = resolvedStyle;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: resolvedStyle,
      center: [longitude, latitude],
      zoom,
    });

    map.on("moveend", () => {
      const center = map.getCenter();
      setViewportRef.current({
        longitude: center.lng,
        latitude: center.lat,
        zoom: map.getZoom(),
      });
    });

    const handleStyleLoad = () => {
      if (mapRef.current !== map) {
        return;
      }
      syncMarkers(map);
    };

    map.on("style.load", handleStyleLoad);
    mapRef.current = map;

    return () => {
      map.off("style.load", handleStyleLoad);
      const markers = markersRef.current;
      markersRef.current = [];
      if (userMarkerRef.current) {
        unmountUserLocationMarker(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      mapRef.current = null;
      unmountLocationMarkers(markers);
      map.remove();
      appliedStyleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- map mounts once; refs hold latest callbacks
  }, [syncMarkers]);

  useEffect(() => {
    const map = mapRef.current;
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!map || !token) {
      return;
    }

    const resolvedStyle = resolveMapStyle(styleUrl, token);
    if (resolvedStyle === appliedStyleRef.current) {
      return;
    }

    appliedStyleRef.current = resolvedStyle;
    map.setStyle(resolvedStyle);
  }, [styleUrl]);

  useEffect(() => {
    if (markersRef.current.length === 0) {
      return;
    }

    updateLocationMarkers(
      markersRef.current,
      mapLocations,
      selectedLocationId,
      selectLocation,
    );
  }, [mapLocations, selectedLocationId, selectLocation]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    syncMarkers(map);
  }, [mapLocations, syncMarkers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) {
      return;
    }

    if (!userMarkerRef.current) {
      userMarkerRef.current = mountUserLocationMarker(
        map,
        userLocation.longitude,
        userLocation.latitude,
      );
      return;
    }

    updateUserLocationMarker(
      userMarkerRef.current,
      userLocation.longitude,
      userLocation.latitude,
    );
  }, [userLocation]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const center = map.getCenter();
    const currentZoom = map.getZoom();
    const hasMoved =
      Math.abs(center.lng - longitude) > 0.0001 ||
      Math.abs(center.lat - latitude) > 0.0001 ||
      Math.abs(currentZoom - zoom) > 0.01;

    if (hasMoved) {
      map.flyTo({ center: [longitude, latitude], zoom, essential: true });
    }
  }, [latitude, longitude, zoom]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/40 p-6 text-center">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            Mapbox token required
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Add{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
            </code>{" "}
            to{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              .env.local
            </code>{" "}
            and restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
