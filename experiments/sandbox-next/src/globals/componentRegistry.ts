import { widgetRegistryInversify } from "./widgetRegistry";

import Button from "../components/button";
import buttonTransformer from "../components/button/button.transformer";
import Menu from "../components/menu";
import menuTransformer from "../components/menu/menu.transformer";
import Link from "../components/link";
import linkTransformer from "../components/link/link.transformer";
import Text from "../components/text";
import textTransformer from "../components/text/text.transformer";

export {
  widgetRegistryInversify
}

widgetRegistryInversify.registerComponent("Button", { Component: Button, transformer: buttonTransformer });
widgetRegistryInversify.registerComponent("Menu", { Component: Menu, transformer: menuTransformer });
widgetRegistryInversify.registerComponent("Link", { Component: Link, transformer: linkTransformer });
widgetRegistryInversify.registerComponent("Text", { Component: Text, transformer: textTransformer });