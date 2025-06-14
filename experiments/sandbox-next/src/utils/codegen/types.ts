export interface CodegenConfig {
  componentsDir: string;
  outputFile: string;
  requiredFiles: string[];
}

export interface ComponentInfo {
  name: string;
  componentPath: string;
  transformerPath?: string;
}

export interface ScanResult {
  components: ComponentInfo[];
  skippedFolders: string[];
  transformerWarnings: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface Template {
  header: string[];
  imports: string[];
  registrations: string[];
}

export interface PathUtils {
  getRelativePath: (from: string, to: string) => string;
  getComponentImportPath: (componentName: string) => string;
  getTransformerImportPath: (
    componentName: string,
    transformerFile: string
  ) => string;
}
