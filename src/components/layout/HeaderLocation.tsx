import { LocationPicker } from "@/features/location/components/LocationPicker";
import { getDefaultLocation } from "@/features/location/default-location";

export async function HeaderLocation() {
  return <LocationPicker defaultLocation={await getDefaultLocation()} />;
}
