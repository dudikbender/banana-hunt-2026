export interface HuntLocation {
  id: string;
  name: string;
  description: string;
  longitude: number;
  latitude: number;
  icon?: "banana" | "house";
}

export const HOME_LOCATION: HuntLocation = {
  id: "home",
  name: "Outpost",
  description: "Cisco Brewing",
  longitude: -71.0958,
  latitude: 42.3463,
  icon: "house",
};

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
    id: "trilliu,",
    name: "Trillium",
    description: "Upscale drinks for low-brow people.",
    longitude: -71.10305212826928,
    latitude: 42.34407245278214,
    icon: "banana",
  },
  {
    id: "bleacher-bar",
    name: "Bleacher Bar",
    description: "The Fenway Faithful are truly bananas.",
    longitude: -71.09676547554166,
    latitude: 42.347114844190635,
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
  {
    id: "sojuba",
    name: "SOJUba",
    description: "Fusion - cause we're classy like that.",
    longitude: -71.09637067391346,
    latitude: 42.345208063332855,
    icon: "banana",
  },
];

/** Every pin shown on the map: home first, then hunt stops. */
export const MAP_LOCATIONS: HuntLocation[] = [HOME_LOCATION, ...HUNT_LOCATIONS];
