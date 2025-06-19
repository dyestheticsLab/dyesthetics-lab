export type RegistryType = "inversify" | "tsyringe";

export interface RegistryPreset {
  importPath: string;
  importName: string;
}

export const registryPresets: Record<RegistryType, RegistryPreset> = {
  inversify: {
    importPath: "./widgetRegistry",
    importName: "widgetRegistryInversify",
  },
  tsyringe: {
    importPath: "./widgetRegistry",
    importName: "widgetRegistryTsyringe",
  },
};
