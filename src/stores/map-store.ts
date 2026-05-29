import { create } from "zustand";

import { HOME_LOCATION, type HuntLocation } from "@/data/locations";

export interface MapViewport {
  longitude: number;
  latitude: number;
  zoom: number;
}

export interface UserLocation {
  longitude: number;
  latitude: number;
  accuracy: number;
}

export type UserLocationStatus =
  | "idle"
  | "tracking"
  | "denied"
  | "unsupported"
  | "error";

interface MapState extends MapViewport {
  selectedLocationId: string | null;
  userLocation: UserLocation | null;
  userLocationStatus: UserLocationStatus;
  setViewport: (viewport: Partial<MapViewport>) => void;
  selectLocation: (location: HuntLocation) => void;
  resetViewport: () => void;
  setUserLocation: (location: UserLocation) => void;
  setUserLocationStatus: (status: UserLocationStatus) => void;
  clearUserLocation: () => void;
}

export const DEFAULT_VIEWPORT: MapViewport = {
  longitude: HOME_LOCATION.longitude,
  latitude: HOME_LOCATION.latitude,
  zoom: 14,
};

export const useMapStore = create<MapState>((set) => ({
  ...DEFAULT_VIEWPORT,
  selectedLocationId: HOME_LOCATION.id,
  userLocation: null,
  userLocationStatus: "idle",

  setViewport: (viewport) => set((state) => ({ ...state, ...viewport })),

  selectLocation: (location) =>
    set({
      selectedLocationId: location.id,
      longitude: location.longitude,
      latitude: location.latitude,
      zoom: 18,
    }),

  resetViewport: () =>
    set({
      ...DEFAULT_VIEWPORT,
      selectedLocationId: HOME_LOCATION.id,
    }),

  setUserLocation: (location) =>
    set({
      userLocation: location,
      userLocationStatus: "tracking",
    }),

  setUserLocationStatus: (status) => set({ userLocationStatus: status }),

  clearUserLocation: () =>
    set({
      userLocation: null,
      userLocationStatus: "idle",
    }),
}));

export const selectUserLocation = (state: MapState) => state.userLocation;

export const selectUserLocationStatus = (state: MapState) =>
  state.userLocationStatus;
