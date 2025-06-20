// Core exports
export { Codegen } from "./core";
export type { Template } from "./types";
export { Scanner } from "./core/scanner";
export { Template as TemplateGenerator } from "./core/template";

// Type exports
export * from "./types";

// Config exports
export { loadConfig, defaultConfig } from "./config";
export { registryPresets } from "./config/presets";

// Error exports
export { CodegenError } from "./utils/errors";
