export interface ComponentValidation {
  hasDefaultExport: boolean;
  filePath: string;
  warnings: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  componentValidation?: ComponentValidation;
  transformerValidation?: ComponentValidation;
}

export interface ValidationIssue {
  file: "index" | "transformer";
  type: "missing_export" | "invalid_import" | "other";
  severity: "warn" | "error";
  message: string;
}

export interface ComponentValidationInfo {
  path: string;
  status: "valid" | "warning" | "error";
  issues: ValidationIssue[];
}

export interface ValidationReport {
  timestamp: string;
  components: {
    [componentName: string]: ComponentValidationInfo;
  };
  summary: {
    total: number;
    valid: number;
    withWarnings: number;
    withErrors: number;
  };
}
