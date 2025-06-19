import type { RegistryType } from "../config/presets";

/**
 * Defines patterns for matching component or transformer files.
 *
 * Supports both exact matches and wildcard patterns:
 * - Exact: "transformer"
 * - Wildcard: "*.transformer" (where * matches component name)
 *
 * @example
 * ```typescript
 * // Match either transformer.tsx or name.transformer.tsx
 * const transformerPattern: FilePattern = {
 *   names: ["transformer", "*.transformer"],
 *   extensions: [".tsx"]
 * };
 * ```
 */
export interface FilePattern {
  /**
   * Base name patterns to match. Can include wildcards:
   * - "*" matches component name
   * - "*.transformer" matches "button.transformer"
   * - "transformer" matches exactly
   */
  names: string[];
  /** Valid file extensions (e.g., [".tsx"] or [".ts", ".tsx"]) */
  extensions: string[];
}

/**
 * Configures file patterns for component and transformer files.
 *
 * The tool uses these patterns to locate and validate files in component directories.
 * Component files must match the index pattern, while transformer files are optional
 * and must match the transformer pattern if present.
 *
 * @example
 * ```typescript
 * const patterns: ComponentFilePatterns = {
 *   index: {
 *     name: 'index',
 *     extensions: ['.tsx']
 *   },
 *   transformer: {
 *     name: 'transformer',
 *     extensions: ['.ts', '.tsx']
 *   }
 * };
 * ```
 */
export interface ComponentFilePatterns {
  /** Pattern for the main component file */
  index: FilePattern;
  /** Pattern for the optional transformer file */
  transformer: FilePattern;
}

/**
 * Configuration for the component registry generation.
 *
 * @example
 * ```typescript
 * const registryConfig: RegistryConfig = {
 *   type: 'inversify',
 *   importPath: './services/registry',
 *   importName: 'componentRegistry'
 * };
 * ```
 */
export interface RegistryConfig {
  /** The type of dependency injection container to use */
  type: RegistryType;
  /**
   * Custom import path for the registry.
   * If not provided, defaults will be used based on the registry type.
   */
  importPath?: string;
  /**
   * Custom name for the imported registry.
   * If not provided, defaults will be used based on the registry type.
   */
  importName?: string;
}

/**
 * Main configuration for the codegen tool.
 *
 * This interface defines all the options available for configuring the component
 * registry generation process. It can be provided either through a configuration
 * file or programmatically.
 *
 * @example
 * ```typescript
 * const config: CodegenConfig = {
 *   componentsDir: 'src/components',
 *   outputFile: 'src/generated/componentRegistry.ts',
 *   filePatterns: {
 *     index: { name: 'index', extensions: ['.tsx'] },
 *     transformer: { name: 'transformer', extensions: ['.ts', '.tsx'] }
 *   },
 *   registry: {
 *     type: 'inversify',
 *     importPath: './services/registry',
 *     importName: 'componentRegistry'
 *   }
 * };
 * ```
 */
export interface CodegenConfig {
  /** Directory containing component folders */
  componentsDir: string;
  /** Path where the generated registry file will be written */
  outputFile: string;
  /** Patterns for identifying component and transformer files */
  filePatterns: ComponentFilePatterns;
  /** Configuration for the registry type and imports */
  registry: RegistryConfig;
}

/**
 * @internal
 * Utility interface for handling file paths and imports.
 */
export interface PathUtils {
  getRelativePath: (from: string, to: string) => string;
  getImportPath: (filePath: string) => string;
  getComponentImportPath: (componentName: string) => string;
  getTransformerImportPath: (
    componentName: string,
    transformerFile: string
  ) => string;
}
