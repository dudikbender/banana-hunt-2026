import { create } from "zustand";

import {
  buildMapLocations,
  DEFAULT_HOME_LOCATION_OPTION_ID,
  resolveHomeLocation,
  type HuntLocation,
} from "@/data/locations";

interface HomeState {
  homeLocationOptionId: string;
  homeLocation: HuntLocation;
  mapLocations: HuntLocation[];
  isHydrated: boolean;
  hydrateFromServer: () => Promise<void>;
  applyHomeOptionId: (optionId: string) => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  homeLocationOptionId: DEFAULT_HOME_LOCATION_OPTION_ID,
  homeLocation: resolveHomeLocation(DEFAULT_HOME_LOCATION_OPTION_ID),
  mapLocations: buildMapLocations(DEFAULT_HOME_LOCATION_OPTION_ID),
  isHydrated: false,

  hydrateFromServer: async () => {
    const response = await fetch("/api/home-location", { cache: "no-store" });
    if (!response.ok) {
      set({ isHydrated: true });
      return;
    }

    const data = (await response.json()) as { homeLocationId: string };
    set({
      homeLocationOptionId: data.homeLocationId,
      homeLocation: resolveHomeLocation(data.homeLocationId),
      mapLocations: buildMapLocations(data.homeLocationId),
      isHydrated: true,
    });
  },

  applyHomeOptionId: (optionId) =>
    set({
      homeLocationOptionId: optionId,
      homeLocation: resolveHomeLocation(optionId),
      mapLocations: buildMapLocations(optionId),
    }),
}));
