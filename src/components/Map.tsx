import React from "react";
import { Map as RMap, TileLayer, Marker, Popup } from "react-leaflet";
import { Box } from "@chakra-ui/core";
import { LatLngLiteral } from "leaflet";
import { Vehicle } from "../hooks/use-entur";
import { useCurrentPosition } from "../hooks/use-position";

interface IMapProps {
  position?: LatLngLiteral;
  zoom?: number;
  vehicles: Map<string, Vehicle>;
}

const DEFAULT_ZOOM = 12;
const DEFAULT_POS = {
  lat: 63.446827,
  lng: 10.421906
};

const BaseMap: React.FC<IMapProps> = ({ zoom = DEFAULT_ZOOM, ...props }) => {
  const position = useCurrentPosition() || DEFAULT_POS;
  const vehicles = Array.from(props.vehicles.keys());
  return (
    <Box h='100vh'>
      <RMap center={[position.lat, position.lng]} zoom={zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        {vehicles.map(v => {
          const ve = props.vehicles.get(v);
          if (ve) {
            return (
              <Marker key={v} position={[ve.pos.lat || 0, ve.pos.lng || 0]}>
                <Popup>{v}</Popup>
              </Marker>
            );
          } else {
            return null;
          }
        })}
      </RMap>
    </Box>
  );
};

export default BaseMap;
