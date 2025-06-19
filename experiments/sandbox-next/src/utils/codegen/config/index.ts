import { cosmiconfig } from "cosmiconfig";
import { defaultConfig } from "./defaults";
import type { CodegenConfig } from "../types";
import { CodegenError } from "../utils/errors";
import { ensureAbsolutePath } from "../utils/paths";

const MODULE_NAME = "dyesthetics";

/**
 * Loads and validates the codegen configuration
 * First tries to find a config file, then falls back to defaults
 * @returns A complete configuration with absolute paths
 */
export async function loadConfig(): Promise<Required<CodegenConfig>> {
  try {
    const explorer = cosmiconfig(MODULE_NAME);
    const result = await explorer.search();

    const loadedConfig = result?.config?.default ?? defaultConfig;

    return {
      ...defaultConfig,
      ...loadedConfig,
      componentsDir: ensureAbsolutePath(loadedConfig.componentsDir),
      outputFile: ensureAbsolutePath(loadedConfig.outputFile),
    };
  } catch (error) {
    throw new CodegenError(
      `Failed to load configuration: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export { defaultConfig } from "./defaults";
