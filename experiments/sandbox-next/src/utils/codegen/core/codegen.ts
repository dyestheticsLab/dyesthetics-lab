import type {
  CodegenConfig,
  ScanResult,
  ValidationReport,
  ComponentValidationInfo,
  ValidationIssue,
  ComponentInfo,
} from "../types";
import { Scanner } from "./scanner";
import { Template } from "./template";
import { writeFile } from "fs/promises";
import { CodegenError } from "../utils/errors";
import { ensureDirectoryExists } from "../utils/paths";
import { loadConfig } from "../config";

enum CodegenErrorCode {
  SCAN_FAILED = "SCAN_FAILED",
  TEMPLATE_GENERATION_FAILED = "TEMPLATE_GENERATION_FAILED",
  FILE_WRITE_FAILED = "FILE_WRITE_FAILED",
}

export class Codegen {
  private readonly scanner: Scanner;
  private readonly config: CodegenConfig;
  private cachedScanResult?: ScanResult;

  static async create(): Promise<Codegen> {
    const config = await loadConfig();
    return new Codegen(config);
  }

  constructor(config: CodegenConfig) {
    this.config = config;
    this.scanner = new Scanner(config);
  }

  private handleError(
    error: unknown,
    code: CodegenErrorCode,
    context: string
  ): never {
    if (error instanceof CodegenError) {
      throw error; // Preserve existing CodegenError
    }
    throw new CodegenError(
      `[${code}] ${context}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  private async getScanResult(refresh = false): Promise<ScanResult> {
    if (!this.cachedScanResult || refresh) {
      try {
        this.cachedScanResult = await this.scanner.scan();
      } catch (error) {
        this.handleError(
          error,
          CodegenErrorCode.SCAN_FAILED,
          "Failed to scan component directory"
        );
      }
    }
    return this.cachedScanResult;
  }

  private generateValidationReport(scanResult: ScanResult): ValidationReport {
    const components: Record<string, ComponentValidationInfo> = {};

    for (const component of scanResult.components) {
      const issues = this.generateComponentIssues(component);
      const { status } = this.determineComponentStatus(issues);

      components[component.name] = {
        path: component.componentPath,
        status,
        issues,
      };
    }

    return {
      timestamp: new Date().toISOString(),
      components,
      summary: this.generateSummary(components),
    };
  }

  private generateComponentIssues(component: ComponentInfo): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (component.validation?.componentValidation) {
      const validation = component.validation.componentValidation;
      if (!validation.hasDefaultExport) {
        issues.push({
          file: "index",
          type: "missing_export",
          severity: "warn",
          message: `Missing default export in index.tsx`,
        });
      }
    }

    if (component.validation?.transformerValidation) {
      const validation = component.validation.transformerValidation;
      if (!validation.hasDefaultExport) {
        issues.push({
          file: "transformer",
          type: "missing_export",
          severity: "warn",
          message: `Missing default export in transformer`,
        });
      }
    }

    return issues;
  }

  private determineComponentStatus(issues: ValidationIssue[]): {
    status: "valid" | "warning" | "error";
  } {
    if (issues.some((i) => i.severity === "error")) {
      return { status: "error" };
    }
    if (issues.some((i) => i.severity === "warn")) {
      return { status: "warning" };
    }
    return { status: "valid" };
  }

  private generateSummary(
    components: Record<string, ComponentValidationInfo>
  ): ValidationReport["summary"] {
    return Object.values(components).reduce(
      (acc, { status }) => {
        if (status === "valid") acc.valid++;
        else if (status === "warning") acc.withWarnings++;
        else acc.withErrors++;
        return acc;
      },
      {
        total: Object.keys(components).length,
        valid: 0,
        withWarnings: 0,
        withErrors: 0,
      }
    );
  }

  async generate(): Promise<void> {
    console.log("🔍 Scanning component directory...");

    try {
      const scanResult = await this.getScanResult(true); // Force fresh scan
      const template = new Template(scanResult, this.config);

      await ensureDirectoryExists(this.config.outputFile);
      await writeFile(this.config.outputFile, template.toString(), "utf-8");

      console.log("✨ Component registry generated successfully");
    } catch (error) {
      this.handleError(
        error,
        CodegenErrorCode.TEMPLATE_GENERATION_FAILED,
        "Failed to generate component registry"
      );
    }
  }

  async validate(): Promise<ValidationReport> {
    console.log("🔍 Validating components...");
    try {
      const scanResult = await this.getScanResult();
      return this.generateValidationReport(scanResult);
    } catch (error) {
      this.handleError(
        error,
        CodegenErrorCode.SCAN_FAILED,
        "Failed to validate components"
      );
    }
  }
}
