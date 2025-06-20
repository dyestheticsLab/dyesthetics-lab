import { join, parse, relative } from "path";
import { mkdir } from "fs/promises";
import type { CodegenConfig, PathUtils } from "../types";

const FILE_EXTENSION_REGEX = /\.[^/.]+$/;

export async function ensureDirectoryExists(filePath: string): Promise<void> {
  const dir = parse(filePath).dir;
  await mkdir(dir, { recursive: true });
}

function cleanImportPath(filePath: string): string {
  return filePath.replace(FILE_EXTENSION_REGEX, "");
}

function getTransformerFileName(transformerPath: string): string {
  return parse(transformerPath).base;
}

export function createPathUtils(config: CodegenConfig): PathUtils {
  const outputDir = parse(config.outputFile).dir;

  return {
    getRelativePath: (from: string, to: string) => relative(from, to),

    getImportPath: (filePath: string) =>
      cleanImportPath(relative(outputDir, filePath)),

    getComponentImportPath: (componentName: string) =>
      cleanImportPath(
        relative(outputDir, join(config.componentsDir, componentName))
      ),

    getTransformerImportPath: (
      componentName: string,
      transformerPath: string
    ) => {
      const fileName = getTransformerFileName(transformerPath);
      return cleanImportPath(
        relative(outputDir, join(config.componentsDir, componentName, fileName))
      );
    },
  };
}

export function ensureAbsolutePath(path: string): string {
  return path.startsWith("/") ? path : join(process.cwd(), path);
}
