import { create } from "zustand";

import { HUNT_LOCATIONS } from "@/data/locations";

const HUNT_LOCATION_IDS = new Set(HUNT_LOCATIONS.map((location) => location.id));

function isHuntLocationId(locationId: string) {
  return HUNT_LOCATION_IDS.has(locationId);
}

interface HuntState {
  visitedLocationIds: string[];
  isVisited: (locationId: string) => boolean;
  markVisited: (locationId: string) => void;
  markUnvisited: (locationId: string) => void;
  toggleVisited: (locationId: string) => void;
  resetVisited: () => void;
}

export const useHuntStore = create<HuntState>((set, get) => ({
  visitedLocationIds: [],

  isVisited: (locationId) => get().visitedLocationIds.includes(locationId),

  markVisited: (locationId) => {
    if (!isHuntLocationId(locationId) || get().isVisited(locationId)) {
      return;
    }

    set((state) => ({
      visitedLocationIds: [...state.visitedLocationIds, locationId],
    }));
  },

  markUnvisited: (locationId) => {
    if (!isHuntLocationId(locationId) || !get().isVisited(locationId)) {
      return;
    }

    set((state) => ({
      visitedLocationIds: state.visitedLocationIds.filter(
        (id) => id !== locationId,
      ),
    }));
  },

  toggleVisited: (locationId) => {
    if (!isHuntLocationId(locationId)) {
      return;
    }

    if (get().isVisited(locationId)) {
      get().markUnvisited(locationId);
      return;
    }

    get().markVisited(locationId);
  },

  resetVisited: () => set({ visitedLocationIds: [] }),
}));

export const selectVisitedCount = (state: HuntState) =>
  state.visitedLocationIds.length;

export const selectUnvisitedCount = (state: HuntState) =>
  HUNT_LOCATIONS.length - state.visitedLocationIds.length;

export const selectTotalHuntLocations = () => HUNT_LOCATIONS.length;
