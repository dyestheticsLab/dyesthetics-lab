import { readdir } from "fs/promises";
import { readFileSync } from "fs";
import { join } from "path";
import type {
  ComponentInfo,
  ScanResult,
  ValidationResult,
  ComponentValidation,
  CodegenConfig,
  ValidationCollector,
  FilePattern,
} from "../types";
import { CodegenError } from "../utils/errors";

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
          componentFiles
        );

        if (!fileValidation.isValid) {
          result.skippedFolders.push(entry.name);
          result.transformerWarnings.push(...fileValidation.errors);
          continue;
        }

        const indexFile = this.findMatchingFile(
          componentFiles,
          this.config.filePatterns.index
        );
        if (!indexFile) continue;

        const transformerFile = this.findMatchingFile(
          componentFiles,
          this.config.filePatterns.transformer
        );

        const componentInfo: ComponentInfo = {
          name: entry.name,
          componentPath: join(componentDir, indexFile),
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

  private validateComponent(
    componentDir: string,
    files: string[]
  ): ValidationResult {
    const collector: ValidationCollector = {
      errors: [],
      warnings: [],
      componentValidation: undefined,
      transformerValidation: undefined,
    };

    const indexFile = this.findMatchingFile(
      files,
      this.config.filePatterns.index
    );
    if (!indexFile) {
      collector.errors.push(
        this.createMissingFileError(
          componentDir,
          this.config.filePatterns.index
        )
      );
      return this.createValidationResult(collector);
    }

    this.validateIndexFile(componentDir, indexFile, collector);
    this.validateTransformerFiles(componentDir, files, collector);

    return this.createValidationResult(collector);
  }

  private validateIndexFile(
    componentDir: string,
    indexFile: string,
    collector: ValidationCollector
  ): void {
    const indexPath = join(componentDir, indexFile);
    const componentValidation = this.validateDefaultExport(indexPath);
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
      this.matchesFilePattern(file, this.config.filePatterns.transformer)
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
    const pattern = this.config.filePatterns.transformer;
    const invalidTransformers = transformerFiles.filter(
      (file) => !pattern.extensions.some((ext) => file.endsWith(ext))
    );

    if (invalidTransformers.length > 0) {
      const warning = `Invalid transformer file extension in ${componentDir}. Valid extensions are: ${pattern.extensions.join(
        ", "
      )}. Found: ${invalidTransformers.join(", ")}`;
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

  private createValidationResult(
    collector: ValidationCollector
  ): ValidationResult {
    return {
      isValid: collector.errors.length === 0,
      errors: collector.errors,
      warnings: collector.warnings,
      componentValidation: collector.componentValidation,
      transformerValidation: collector.transformerValidation,
    };
  }

  private findMatchingFile(
    files: string[],
    pattern: FilePattern
  ): string | undefined {
    return files.find((file) => this.matchesFilePattern(file, pattern));
  }

  private matchesFilePattern(file: string, pattern: FilePattern): boolean {
    const baseName = file.substring(0, file.lastIndexOf("."));
    const extension = file.substring(file.lastIndexOf("."));

    // For transformers, allow component name prefix (e.g., button.transformer.tsx)
    if (pattern.name === "transformer") {
      return (
        baseName.endsWith(".transformer") &&
        pattern.extensions.includes(extension)
      );
    }

    // For other patterns (like index), require exact name match
    return baseName === pattern.name && pattern.extensions.includes(extension);
  }

  private createMissingFileError(
    componentDir: string,
    pattern: FilePattern
  ): string {
    const examples = pattern.extensions
      .map((ext) => `${pattern.name}${ext}`)
      .join(" or ");
    return `Missing required file: ${examples} in ${componentDir}`;
  }
}
