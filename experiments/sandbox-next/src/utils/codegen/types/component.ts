import type { ValidationResult } from "../types";

/**
 * Result of matching a file against a file pattern.
 * Used for both exact matches and wildcard patterns that can extract component names.
 * 
 * @example
 * ```typescript
 * // Exact match for index.tsx
 * const indexMatch: FileMatch = {
 *   file: "index.tsx"
 * };
 * 
 * // Wildcard match for button.transformer.tsx
 * const transformerMatch: FileMatch = {
 *   file: "button.transformer.tsx",
 *   componentName: "button"
 * };
 * ```
 */
export interface FileMatch {
  /** The matched file name */
  file: string;
  /** 
   * Component name extracted from wildcard pattern.
   * Only present when matching patterns like "*.transformer"
   */
  componentName?: string;
}

/**
 * Information about a discovered component.
 * 
 * This interface represents a component found during the scanning process,
 * including its name, file paths, and validation results.
 * 
 * @example
 * ```typescript
 * const buttonComponent: ComponentInfo = {
 *   name: "Button",
 *   componentPath: "src/components/Button/index.tsx",
 *   transformerPath: "src/components/Button/button.transformer.tsx",
 *   validation: {
 *     isValid: true,
 *     errors: [],
 *     warnings: []
 *   }
 * };
 * ```
 */
export interface ComponentInfo {
  /** Name of the component, derived from its directory name */
  name: string;
  /** Absolute path to the component's index file */
  componentPath: string;
  /** Absolute path to the component's transformer file, if it exists */
  transformerPath?: string;
  /** Results of validating the component's files */
  validation?: ValidationResult;
}

/**
 * @internal
 * Template structure for code generation.
 */
export interface Template {
  header: string[];
  imports: string[];
  registrations: string[];
}

/**
 * Result of scanning the components directory.
 * 
 * Contains information about all discovered components, any folders that were
 * skipped due to validation failures, and warnings about transformer files.
 * 
 * @example
 * ```typescript
 * const scanResult: ScanResult = {
 *   components: [
 *     { name: "Button", componentPath: "..." },
 *     { name: "Menu", componentPath: "..." }
 *   ],
 *   skippedFolders: ["InvalidComponent"],
 *   transformerWarnings: [
 *     "Multiple transformer files found in src/components/Button"
 *   ]
 * };
 * ```
 */
export interface ScanResult {
  /** List of valid components found during scanning */
  components: ComponentInfo[];
  /** List of folder names that were skipped due to validation failures */
  skippedFolders: string[];
  /** Warnings related to transformer files */
  transformerWarnings: string[];
}
