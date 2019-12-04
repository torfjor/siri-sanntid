import { useEffect, useState, useRef } from "react";
import { v4 as uuid } from "uuid";

const CLIENT_UUID = uuid();
const ENTUR_RT_ENDPOINT = "https://api.entur.io/realtime/v1/rest/vm";
const ENTUR_RT_DATASETS = "ATB";
const ENTUR_RT_ENDPOINT_URI = `${ENTUR_RT_ENDPOINT}?datasetId=${ENTUR_RT_DATASETS}&requestorId=${CLIENT_UUID}`;

export interface Vehicle {
  id: string;
  pos: {
    lat: number;
    lng: number;
  };
}

type ValueObject<T> = {
  value: T;
};

type VehicleActivity = {
  MonitoredVehicleJourney: {
    LineRef: ValueObject<string>;
    DirectionRef: ValueObject<string>;
    VehicleMode: ValueObject<string>;
    RouteRef: ValueObject<string>;
    PublishedLineName: ValueObject<string>[];
    OriginRef: ValueObject<string>;
    OriginName: ValueObject<string>[];
    DestinationRef: ValueObject<string>;
    DestinationName: ValueObject<string>[];
    OriginAimedDepartureTime: string;
    DestinationAimedArrivalTime: string;
    Monitored: boolean;
    DataSource: string;
    VehicleLocation: {
      Longitude: number;
      Latitude: number;
    };
    VehicleRef: ValueObject<string>;
    RecordedAtTime: string;
  };
  ProgressBetweenStops: {
    LinkDistance: number;
    Percentage: number;
  };
  RecordedAtTime: string;
  ValidUntilTime: string;
};

export function useVehicleMonitoring() {
  const [vehicles, setVehicles] = useState<Map<string, Vehicle>>(new Map());
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(ENTUR_RT_ENDPOINT_URI, {
          headers: {
            Accept: "application/json"
          }
        });

        const data = await response.json();
        const vDelta = parseData(data);

        setVehicles(vehicles => {
          vDelta.forEach(v => vehicles.set(v.id, v));

          return new Map(vehicles);
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();

    // Set up an interval to poll for updates
    timer.current = setInterval(() => {
      fetchData();
    }, 20 * 1000);

    // Clear timer on unmount
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  }, []);

  return vehicles;
}

// Filter out entries older than 12h
function filterData(data: any): any {
  const d: VehicleActivity[] =
    data.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity;
}

function parseData(data: any): Vehicle[] {
  let v: Vehicle[] = [];
  if (data.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity) {
    v = data.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity.map(
      (va: VehicleActivity) => {
        return {
          id: va.MonitoredVehicleJourney.VehicleRef.value,
          pos: {
            lat: va.MonitoredVehicleJourney.VehicleLocation.Latitude,
            lng: va.MonitoredVehicleJourney.VehicleLocation.Longitude
          }
        };
      }
    );
  }
  return v.filter();
}
