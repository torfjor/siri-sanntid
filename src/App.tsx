import React from "react";
import { Stack } from "@chakra-ui/core";
import BaseMap from "./components/Map";
import { useVehicleMonitoring } from "./hooks/use-vehiclemonitoring";

interface IAppProps {}

const App: React.FC<IAppProps> = props => {
  const vehicles = useVehicleMonitoring();

  return (
    <Stack mx="auto" spacing={0}>
      <BaseMap vehicles={vehicles} />
    </Stack>
  );
};

export default App;
