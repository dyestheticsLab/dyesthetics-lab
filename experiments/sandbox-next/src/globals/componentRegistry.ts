import { widgetRegistryInversify } from "./widgetRegistry";

import Button from "../components/button";
import transformer from "../components/button/button.transformer";

export {
  widgetRegistryInversify
}

widgetRegistryInversify.registerComponent("Button", { Component: Button, transformer });