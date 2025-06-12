import { WidgetRegistryTSyringe } from "@/services/WidgetRegistryTsyringe";
import { globalRegistryTsyringe } from "./globalRegistry";



export const widgetRegistryTsyringe = WidgetRegistryTSyringe.createContainerRegistry(globalRegistryTsyringe)
