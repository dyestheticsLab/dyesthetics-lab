import { readdir } from "fs/promises";
import { readFileSync } from "fs";
import { join } from "path";
import type {
  ComponentInfo,
  ScanResult,
  ValidationResult,
  ComponentValidation,
  CodegenConfig,
} from "../types";
import { CodegenError } from "../utils/errors";

interface ValidationCollector {
  errors: string[];
  warnings: string[];
  componentValidation?: ComponentValidation;
  transformerValidation?: ComponentValidation;
}

export class Scanner {
  private static readonly INLINE_DEFAULT_EXPORT_PATTERN =
    /export\s+default\s+[^;]+/;
  private static readonly NAMED_DEFAULT_EXPORT_PATTERN =
    /export\s*{\s*\w+\s+as\s+default\s*}/;

  private readonly config: CodegenConfig;

  constructor(config: CodegenConfig) {
    this.config = config;
  }

  public async scan(): Promise<ScanResult> {
    const result: ScanResult = {
      components: [],
      skippedFolders: [],
      transformerWarnings: [],
    };

    try {
      const entries = await readdir(this.config.componentsDir, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const componentDir = join(this.config.componentsDir, entry.name);
        const componentFiles = await readdir(componentDir);

        const fileValidation = this.validateComponent(
          componentDir,
          componentFiles,
          this.config
        );
        if (!fileValidation.isValid) {
          result.skippedFolders.push(entry.name);
          result.transformerWarnings.push(...fileValidation.errors);
          continue;
        }

        const transformerFile = componentFiles.find((file) =>
          file.includes("transformer.tsx")
        );

        const componentInfo: ComponentInfo = {
          name: entry.name,
          componentPath: join(componentDir, "index.tsx"),
          transformerPath: transformerFile
            ? join(componentDir, transformerFile)
            : undefined,
          validation: fileValidation,
        };

        result.components.push(componentInfo);
      }
    } catch (error) {
      throw new CodegenError("Error scanning component directory", error);
    }

    return result;
  }

  private validateRequiredFiles(
    componentDir: string,
    files: string[],
    collector: ValidationCollector
  ): void {
    for (const requiredFile of this.config.requiredFiles) {
      if (!files.includes(requiredFile)) {
        const error = `Missing required file: ${requiredFile} in ${componentDir}`;
        console.warn("⚠️ ", error);
        collector.errors.push(error);
      }
    }
  }

  private validateIndexFile(
    componentDir: string,
    collector: ValidationCollector
  ): void {
    const indexFile = join(componentDir, "index.tsx");
    const componentValidation = this.validateDefaultExport(indexFile);
    if (componentValidation.warnings.length > 0) {
      console.warn("⚠️ ", componentValidation.warnings[0]);
    }
    collector.warnings.push(...componentValidation.warnings);
    collector.componentValidation = componentValidation;
  }

  private validateTransformerFiles(
    componentDir: string,
    files: string[],
    collector: ValidationCollector
  ): void {
    const transformerFiles = files.filter((file) =>
      file.includes("transformer")
    );

    this.validateTransformerCount(componentDir, transformerFiles, collector);
    this.validateTransformerExtensions(
      componentDir,
      transformerFiles,
      collector
    );
    this.validateTransformerExports(componentDir, transformerFiles, collector);
  }

  private validateTransformerCount(
    componentDir: string,
    transformerFiles: string[],
    collector: ValidationCollector
  ): void {
    if (transformerFiles.length > 1) {
      const warning = `Multiple transformer files found in ${componentDir}`;
      console.warn("⚠️ ", warning);
      collector.warnings.push(warning);
    }
  }

  private validateTransformerExtensions(
    componentDir: string,
    transformerFiles: string[],
    collector: ValidationCollector
  ): void {
    const invalidTransformers = transformerFiles.filter(
      (file) => !file.endsWith(".tsx")
    );
    if (invalidTransformers.length > 0) {
      const warning = `Invalid transformer file extension in ${componentDir}: ${invalidTransformers.join(
        ", "
      )}`;
      console.warn("⚠️ ", warning);
      collector.warnings.push(warning);
    }
  }

  private validateTransformerExports(
    componentDir: string,
    transformerFiles: string[],
    collector: ValidationCollector
  ): void {
    if (transformerFiles.length === 1) {
      const transformerFile = join(componentDir, transformerFiles[0]);
      const transformerValidation = this.validateDefaultExport(transformerFile);
      if (transformerValidation.warnings.length > 0) {
        console.warn("⚠️ ", transformerValidation.warnings[0]);
      }
      collector.warnings.push(...transformerValidation.warnings);
      collector.transformerValidation = transformerValidation;
    }
  }

  private validateDefaultExport(filePath: string): ComponentValidation {
    try {
      const content = readFileSync(filePath, "utf-8");
      const hasDefaultExport = this.checkForDefaultExport(content);

      return {
        hasDefaultExport,
        filePath,
        warnings: hasDefaultExport
          ? []
          : [`Missing default export in ${filePath}`],
      };
    } catch (error) {
      return this.createFileReadError(filePath, error);
    }
  }

  private checkForDefaultExport(content: string): boolean {
    return (
      Scanner.INLINE_DEFAULT_EXPORT_PATTERN.test(content) ||
      Scanner.NAMED_DEFAULT_EXPORT_PATTERN.test(content)
    );
  }

  private createFileReadError(
    filePath: string,
    error: unknown
  ): ComponentValidation {
    return {
      hasDefaultExport: false,
      filePath,
      warnings: [
        `Could not read file ${filePath}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      ],
    };
  }

  private validateComponent(
    componentDir: string,
    files: string[],
    config: CodegenConfig
  ): ValidationResult {
    const collector = this.createValidationCollector();

    this.validateRequiredFiles(componentDir, files, collector);
    this.validateIndexFile(componentDir, collector);
    this.validateTransformerFiles(componentDir, files, collector);

    return {
      isValid: collector.errors.length === 0,
      errors: collector.errors,
      warnings: collector.warnings,
      componentValidation: collector.componentValidation,
      transformerValidation: collector.transformerValidation,
    };
  }

  private createValidationCollector(): ValidationCollector {
    return {
      errors: [],
      warnings: [],
    };
  }
}
