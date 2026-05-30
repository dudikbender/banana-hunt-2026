import { HomeHydrator } from "@/components/home-hydrator";
import { LocationPanel } from "@/components/map/location-panel";
import { MapView } from "@/components/map/map-view";
import { ParticipantDialog } from "@/components/participant/participant-dialog";

export default function Home() {
  return (
    <div className="relative h-full min-h-0 flex-1">
      <HomeHydrator />
      <MapView />
      <LocationPanel />
      <ParticipantDialog />
    </div>
  );
}
