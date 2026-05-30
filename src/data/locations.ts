export interface HuntLocation {
  id: string;
  name: string;
  description: string;
  longitude: number;
  latitude: number;
  icon?: "banana" | "house";
}

export interface HomeLocationOption {
  id: string;
  name: string;
  description: string;
  longitude: number;
  latitude: number;
}

export const HOME_LOCATION_OPTIONS: HomeLocationOption[] = [
  {
    id: "hojuku",
    name: "Hojuku",
    description: "Start the hunt from Hojuku.",
    longitude: -71.09663605567268,
    latitude: 42.345065728326354,
  },
  {
    id: "cisco-outpost",
    name: "Cisco Brewing Outpost",
    description: "Meet at the Cisco Brewing outpost.",
    longitude: -71.09839180999428,
    latitude: 42.34469063325755,
  },
  {
    id: "yard-house",
    name: "Yard House",
    description: "Classic sports bar in the shadow of Fenway Park.",
    longitude: -71.10029072005652,
    latitude: 42.34534695338152,
  },
];

export const DEFAULT_HOME_LOCATION_OPTION_ID = "hojuku";

const HOME_LOCATION_OPTION_IDS = new Set(
  HOME_LOCATION_OPTIONS.map((option) => option.id),
);

export function isHomeLocationOptionId(
  value: string,
): value is (typeof HOME_LOCATION_OPTIONS)[number]["id"] {
  return HOME_LOCATION_OPTION_IDS.has(value);
}

export function getHomeLocationOption(id: string): HomeLocationOption {
  return (
    HOME_LOCATION_OPTIONS.find((option) => option.id === id) ??
    HOME_LOCATION_OPTIONS[0]
  );
}

/** Map pin for the active home base — always uses id "home". */
export function resolveHomeLocation(optionId: string): HuntLocation {
  const option = getHomeLocationOption(optionId);

  return {
    id: "home",
    name: option.name,
    description: option.description,
    longitude: option.longitude,
    latitude: option.latitude,
    icon: "house",
  };
}

export function buildMapLocations(optionId: string): HuntLocation[] {
  return [resolveHomeLocation(optionId), ...HUNT_LOCATIONS];
}

/** @deprecated Use resolveHomeLocation with the active option id. */
export const HOME_LOCATION = resolveHomeLocation(
  DEFAULT_HOME_LOCATION_OPTION_ID,
);

export const HUNT_LOCATIONS: HuntLocation[] = [
  {
    id: "bullpen-kitchen",
    name: "Bullpen Kitchen & Tap",
    description: "Get warmed up in the pen.",
    longitude: -71.09874833883022,
    latitude: 42.34602479374535,
    icon: "banana",
  },
  {
    id: "mighty-squirrel",
    name: "Mighty Squirrel",
    description: "Where all the nuts hang out.",
    longitude: -71.10118544721644,
    latitude: 42.34707272049145,
    icon: "banana",
  },
  {
    id: "cask-n-flagon",
    name: "Cask & Flagon",
    description: "Sticky floors, broken dreams.",
    longitude: -71.09817064443291,
    latitude: 42.347294686966634,
    icon: "banana",
  },
  {
    id: "cheeky-monkey",
    name: "Cheeky Monkey",
    description: "Hang out, grab a banana?",
    longitude: -71.0948224113736,
    latitude: 42.3473531106415,
    icon: "banana",
  },
  {
    id: "trillium",
    name: "Trillium",
    description: "Upscale drinks for low-brow people.",
    longitude: -71.10305212826928,
    latitude: 42.34407245278214,
    icon: "banana",
  },
  {
    id: "fenway-grill",
    name: "Fenway Bar & Grill",
    description: "The Fenway Faithful are truly bananas.",
    longitude: -71.0993234560284,
    latitude: 42.34297505257703,
    icon: "banana",
  },
  {
    id: "cornwalls",
    name: "Cornwalls",
    description: "Fuck the British, but their beer is good.",
    longitude: -71.09570800615265,
    latitude: 42.349427763095534,
    icon: "banana",
  },
  {
    id: "kenmore",
    name: "The Kenmore",
    description: "Classy name, disreputable clientele.",
    longitude: -71.09386167488856,
    latitude: 42.34861761409886,
    icon: "banana",
  },
  {
    id: "game-on",
    name: "Game On!",
    description: "Get it on, you got to get it on.",
    longitude: -71.09833775888028,
    latitude: 42.347052484705166,
    icon: "banana",
  },
];

/** @deprecated Use buildMapLocations with the active option id. */
export const MAP_LOCATIONS: HuntLocation[] = buildMapLocations(
  DEFAULT_HOME_LOCATION_OPTION_ID,
);
