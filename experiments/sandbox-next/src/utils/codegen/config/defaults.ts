import { join } from "path";
import type { CodegenConfig } from "../types";

/**
 * Default configuration for the codegen tool
 * These values are used when no configuration file is found
 * or when specific values are not provided in the config file
 */
export const defaultConfig: CodegenConfig = {
  componentsDir: join(process.cwd(), "src/components"),
  outputFile: join(process.cwd(), "src/generated/componentRegistry.ts"),
  requiredFiles: ["index.tsx"],
  registry: {
    type: "inversify",
  },
};
