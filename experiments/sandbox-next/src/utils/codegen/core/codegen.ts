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

const enum CodegenErrorCode {
  GENERATION_FAILED = "GENERATION_FAILED",
  WRITE_FAILED = "WRITE_FAILED",
  VALIDATION_FAILED = "VALIDATION_FAILED"
}

export class Codegen {
  private readonly scanner: Scanner;
  private readonly config: CodegenConfig;

  static async create(): Promise<Codegen> {
    const config = await loadConfig();
    const scanner = new Scanner(config);
    return new Codegen(config, scanner);
  }

  constructor(config: CodegenConfig, scanner: Scanner) {
    this.config = config;
    this.scanner = scanner;
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

  public async generate(): Promise<void> {
    console.log("🔍 Scanning component directory...");

    try {
      const scanResult = await this.scanner.scan();

      const template = new Template(scanResult, this.config);
      const content = template.toString();

      await ensureDirectoryExists(this.config.outputFile);
      try {
        await writeFile(this.config.outputFile, content, "utf-8");
      } catch (error) {
        throw new CodegenError(
          `[${CodegenErrorCode.WRITE_FAILED}] Failed to write registry file: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }

      console.log("✨ Component registry generated successfully");
    } catch (error) {
      if (error instanceof CodegenError) throw error;
      
      throw new CodegenError(
        `[${CodegenErrorCode.GENERATION_FAILED}] Failed to generate component registry: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public async getValidationReport(): Promise<ValidationReport> {
    console.log("🔍 Analyzing components...");
    try {
      const scanResult = await this.scanner.scan();
      return this.generateValidationReport(scanResult);
    } catch (error) {
      if (error instanceof CodegenError) throw error;

      throw new CodegenError(
        `[${CodegenErrorCode.VALIDATION_FAILED}] Failed to analyze components: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
