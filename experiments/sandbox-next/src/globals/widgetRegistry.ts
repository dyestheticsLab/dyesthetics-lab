import { WidgetRegistryInversify } from "../services/WidgetRegistryInversify";
import { globalRegistry } from "./globalRegistry";



export const widgetRegistryInversify = WidgetRegistryInversify.createContinerRegistry(globalRegistry)
