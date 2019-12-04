import * as React from "react";
import { render } from "react-dom";
import { theme, ThemeProvider, CSSReset } from "@chakra-ui/core";
import App from "./App";

render(
  <ThemeProvider theme={theme}>
    <CSSReset />
    <App />
  </ThemeProvider>,
  document.getElementById("app")
);
