import { join, parse, relative } from "path";
import type { CodegenConfig, PathUtils } from "./types";

export const CONFIG: CodegenConfig = {
  componentsDir: join(process.cwd(), "src/components"),
  outputFile: join(process.cwd(), "src/globals/componentRegistry.codegen.ts"),
  requiredFiles: ["index.tsx"],
};

export function createPathUtils(config: CodegenConfig): PathUtils {
  const outputDir = parse(config.outputFile).dir;

  return {
    getRelativePath: (from: string, to: string) => relative(from, to),
    getComponentImportPath: (componentName: string) =>
      relative(outputDir, join(config.componentsDir, componentName)),
    getTransformerImportPath: (
      componentName: string,
      transformerFile: string
    ) =>
      relative(
        outputDir,
        join(config.componentsDir, componentName, transformerFile)
      ),
  };
}

export const pathUtils = createPathUtils(CONFIG);
