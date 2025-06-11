import { widgetRegistryInversify } from "./widgetRegistry";

import Button from "../components/button";
import transformer from "../components/button/button.transformer";
import Icon from "@/components/icon";
import transformerIcon from "@/components/icon/icon.transformer";

export {
  widgetRegistryInversify
}

widgetRegistryInversify.registerComponent("Button", { Component: Button, transformer });
widgetRegistryInversify.registerComponent("Icon", { Component: Icon, transformer: transformerIcon });
