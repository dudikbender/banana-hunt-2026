import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

import {
  DEFAULT_HOME_LOCATION_OPTION_ID,
  isHomeLocationOptionId,
} from "@/data/locations";

const CONFIG_DIR = path.join(process.cwd(), "data");
const CONFIG_PATH = path.join(CONFIG_DIR, "home-config.json");

export interface HomeConfig {
  homeLocationId: string;
}

export function readHomeConfig(): HomeConfig {
  try {
    if (existsSync(CONFIG_PATH)) {
      const parsed = JSON.parse(readFileSync(CONFIG_PATH, "utf8")) as HomeConfig;
      if (isHomeLocationOptionId(parsed.homeLocationId)) {
        return parsed;
      }
    }
  } catch {
    // fall through to default
  }

  return { homeLocationId: DEFAULT_HOME_LOCATION_OPTION_ID };
}

export function writeHomeConfig(config: HomeConfig): void {
  if (!isHomeLocationOptionId(config.homeLocationId)) {
    throw new Error("Invalid home location id");
  }

  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(
    CONFIG_PATH,
    `${JSON.stringify(config, null, 2)}\n`,
    "utf8",
  );
}
