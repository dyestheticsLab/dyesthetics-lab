import Button from "@/components/button";
import { widgetRegistryTsyringe } from "./widgetRegistry";
import transformer from "@/components/button/button.transformer";

export {
  widgetRegistryTsyringe
}

widgetRegistryTsyringe.registerComponent("Button", { Component: Button, transformer });