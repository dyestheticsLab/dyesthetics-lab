import { join } from "path";
import { Codegen } from "../core";
import { defaultConfig } from '../config';
import type { RegistryType } from '../config/presets';
import { CodegenError } from "../utils/errors";

/**
 * Example 1: Using file-based configuration
 * This will look for configuration in:
 * - dyesthetics.config.{js,cjs,mjs,ts}
 * - .dyestheticsrc{,.json,.yaml,.yml,.js,.cjs}
 * - package.json with "dyesthetics" field
 */
async function fileBasedExample() {
  console.log("📖 Using file-based configuration...");
  console.log("Looking for config files: dyesthetics.config.ts, .dyestheticsrc, etc.");

  const codegen = await Codegen.create();
  
  // Generate the component registry
  await codegen.generate();
  
  // Validate and get a report
  const report = await codegen.validate();
  
  // Example validation report output:
  // {
  //   "timestamp": "2025-06-18T10:00:00.000Z",
  //   "components": {
  //     "Button": {
  //       "path": "/path/to/components/Button/index.tsx",
  //       "status": "valid",
  //       "issues": []
  //     }
  //   },
  //   "summary": {
  //     "total": 1,
  //     "valid": 1,
  //     "withWarnings": 0,
  //     "withErrors": 0
  //   }
  // }
  console.log("\nValidation Report:");
  console.log(JSON.stringify(report, null, 2));
}

/**
 * Example 2: Using programmatic configuration
 * This demonstrates how to:
 * - Override default configuration
 * - Use a different registry type (tsyringe)
 * - Customize registry paths
 */
async function programmaticExample() {
  console.log("\n⚙️ Using programmatic configuration...");

  const config = {
    ...defaultConfig,
    // Specify component directory
    componentsDir: join(process.cwd(), "src/components"),
    
    // Specify output file location
    outputFile: join(process.cwd(), "src/generated/componentRegistry.ts"),
    
    // Configure the registry
    registry: {
      // Use tsyringe instead of default inversify
      type: 'tsyringe' as RegistryType,
      
      // Optional: customize registry paths
      importPath: './services/registry',  // Default: './widgetRegistry'
      importName: 'componentRegistry',    // Default: 'widgetRegistryTsyringe'
    },
  };

  const codegen = new Codegen(config);
  await codegen.generate();
  
  const report = await codegen.validate();
  console.log("\nValidation Report:");
  console.log(JSON.stringify(report, null, 2));
}

async function main() {
  try {
    // Example 1: File-based configuration
    await fileBasedExample();

    // Example 2: Programmatic configuration
    await programmaticExample();

  } catch (error) {
    // Handle specific codegen errors
    if (error instanceof CodegenError) {
      console.error("Codegen Error:", error.message);
      if (error.details) {
        console.error("Details:", error.details);
      }
    } else {
      console.error("Unexpected error:", error);
    }
    process.exit(1);
  }
}

// Run the examples
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
