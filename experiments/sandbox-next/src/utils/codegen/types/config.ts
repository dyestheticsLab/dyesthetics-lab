import type { RegistryType } from "../config/presets";
export interface FilePattern {
  name: string;
  extensions: string[];
}

export interface ComponentFilePatterns {
  index: FilePattern;
  transformer: FilePattern;
}

export interface RegistryConfig {
  type: RegistryType;
  importPath?: string;
  importName?: string;
}

export interface CodegenConfig {
  componentsDir: string;
  outputFile: string;
  requiredFiles: string[];
  registry: RegistryConfig;
}

export interface PathUtils {
  getRelativePath: (from: string, to: string) => string;
  getImportPath: (filePath: string) => string;
  getComponentImportPath: (componentName: string) => string;
  getTransformerImportPath: (
    componentName: string,
    transformerFile: string
  ) => string;
}
