/**
 * @internal
 * Internal type for collecting validation results during the scanning process.
 */
export interface ValidationCollector {
  errors: string[];
  warnings: string[];
  componentValidation?: ComponentValidation;
  transformerValidation?: ComponentValidation;
}

/**
 * Results of validating a single file's exports.
 */
export interface ComponentValidation {
  /** Whether the file has a default export */
  hasDefaultExport: boolean;
  /** Path to the validated file */
  filePath: string;
  /** Any warnings generated during validation */
  warnings: string[];
}

/**
 * Complete validation result for a component.
 *
 * Includes overall validity status and specific validation results
 * for both the component and its transformer (if present).
 */
export interface ValidationResult {
  /** Whether the component is valid overall */
  isValid: boolean;
  /** Critical issues that caused validation to fail */
  errors: string[];
  /** Non-critical issues found during validation */
  warnings: string[];
  /** Results of validating the component file */
  componentValidation?: ComponentValidation;
  /** Results of validating the transformer file, if present */
  transformerValidation?: ComponentValidation;
}

/**
 * Represents a single validation issue found in a component.
 *
 * @example
 * ```typescript
 * const issue: ValidationIssue = {
 *   file: "index",
 *   type: "missing_export",
 *   severity: "warn",
 *   message: "Missing default export in index.tsx"
 * };
 * ```
 */
export interface ValidationIssue {
  /** Which file has the issue */
  file: "index" | "transformer";
  /** Type of the issue */
  type: "missing_export" | "invalid_import" | "other";
  /** Issue severity */
  severity: "warn" | "error";
  /** Human-readable description of the issue */
  message: string;
}

/**
 * Validation information for a specific component.
 *
 * @example
 * ```typescript
 * const info: ComponentValidationInfo = {
 *   path: "src/components/Button/index.tsx",
 *   status: "warning",
 *   issues: [{
 *     file: "transformer",
 *     type: "missing_export",
 *     severity: "warn",
 *     message: "Missing default export in transformer"
 *   }]
 * };
 * ```
 */
export interface ComponentValidationInfo {
  /** Path to the component */
  path: string;
  /** Overall status of the component */
  status: "valid" | "warning" | "error";
  /** List of issues found during validation */
  issues: ValidationIssue[];
}

/**
 * Complete validation report for all components.
 *
 * This is the main validation output that users will interact with.
 * It provides detailed information about the validation status of all
 * components and a summary of the results.
 *
 * @example
 * ```typescript
 * const report = await codegen.getValidationReport();
 * console.log(`Found ${report.summary.total} components`);
 * console.log(`${report.summary.valid} valid`);
 * console.log(`${report.summary.withWarnings} with warnings`);
 * ```
 */
export interface ValidationReport {
  /** When the validation was performed */
  timestamp: string;
  /** Validation results for each component, keyed by component name */
  components: {
    [componentName: string]: ComponentValidationInfo;
  };
  /** Statistical summary of the validation results */
  summary: {
    /** Total number of components checked */
    total: number;
    /** Number of completely valid components */
    valid: number;
    /** Number of components with warnings */
    withWarnings: number;
    /** Number of components with errors */
    withErrors: number;
  };
}
