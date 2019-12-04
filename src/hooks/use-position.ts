import { useState } from "react";
import { LatLngLiteral } from "leaflet";

export function useCurrentPosition() {
  const [pos, setPos] = useState<LatLngLiteral>();
  if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(pos => {
      setPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }

  return pos;
}
