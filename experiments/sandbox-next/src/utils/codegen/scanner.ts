import { readdir } from "fs/promises";
import { join } from "path";
import type { ComponentInfo, ScanResult, ValidationResult } from "./types";
import { CONFIG } from "./paths";
import { CodegenError } from "./errors";

export function validateComponent(
  componentDir: string,
  files: string[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const requiredFile of CONFIG.requiredFiles) {
    if (!files.includes(requiredFile)) {
      errors.push(`Missing required file: ${requiredFile} in ${componentDir}`);
    }
  }

  // TODO: maybe use regex instead of "transformer"? the regex accepts "transformer.ts" or "transformer.tsx"
  const transformerFiles = files.filter((file) => file.includes("transformer"));
  if (transformerFiles.length > 1) {
    warnings.push(`Multiple transformer files found in ${componentDir}`);
  }

  const invalidTransformers = transformerFiles.filter(
    (file) => !file.endsWith(".tsx")
  );
  if (invalidTransformers.length > 0) {
    warnings.push(
      `Invalid transformer file extension in ${componentDir}: ${invalidTransformers.join(
        ", "
      )}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export async function scanComponentDirectory(): Promise<ScanResult> {
  const result: ScanResult = {
    components: [],
    skippedFolders: [],
    transformerWarnings: [],
  };

  try {
    const entries = await readdir(CONFIG.componentsDir, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const componentDir = join(CONFIG.componentsDir, entry.name);
      const componentFiles = await readdir(componentDir);

      const validation = validateComponent(componentDir, componentFiles);
      if (!validation.isValid) {
        result.skippedFolders.push(entry.name);
        result.transformerWarnings.push(...validation.errors);
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
      };

      result.components.push(componentInfo);
    }
  } catch (error) {
    throw new CodegenError("Error scanning component directory", error);
  }

  return result;
}
