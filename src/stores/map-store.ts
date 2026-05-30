import { create } from "zustand";

import {
  resolveHomeLocation,
  DEFAULT_HOME_LOCATION_OPTION_ID,
  type HuntLocation,
} from "@/data/locations";
import { useHomeStore } from "@/stores/home-store";

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

function getInitialHomeLocation() {
  return resolveHomeLocation(DEFAULT_HOME_LOCATION_OPTION_ID);
}

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

const initialHome = getInitialHomeLocation();

export const DEFAULT_VIEWPORT: MapViewport = {
  longitude: initialHome.longitude,
  latitude: initialHome.latitude,
  zoom: 14,
};

export const useMapStore = create<MapState>((set) => ({
  ...DEFAULT_VIEWPORT,
  selectedLocationId: initialHome.id,
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

  resetViewport: () => {
    const home = useHomeStore.getState().homeLocation;

    set({
      longitude: home.longitude,
      latitude: home.latitude,
      zoom: 14,
      selectedLocationId: home.id,
    });
  },

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
