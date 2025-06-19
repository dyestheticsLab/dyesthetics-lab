import type { ValidationResult } from "../types";

export interface FileMatch {
  file: string;
  componentName?: string;
}
export interface ComponentInfo {
  name: string;
  componentPath: string;
  transformerPath?: string;
  validation?: ValidationResult;
}

export interface Template {
  header: string[];
  imports: string[];
  registrations: string[];
}

export interface ScanResult {
  components: ComponentInfo[];
  skippedFolders: string[];
  transformerWarnings: string[];
}
