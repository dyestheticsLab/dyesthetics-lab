import { writeFile } from "fs/promises";
import { CONFIG } from "./paths";
import { scanComponentDirectory } from "./scanner";
import { generateTemplate } from "./template";
import { CodegenError } from "./errors";
import type { ScanResult } from "./types";

export { CONFIG } from "./paths";

function logScanResults(result: ScanResult) {
  if (result.skippedFolders.length > 0) {
    console.warn(
      "⚠️  Skipped folders (missing index.tsx):",
      result.skippedFolders.join(", ")
    );
  }

  if (result.transformerWarnings.length > 0) {
    console.warn(
      "⚠️  Validation warnings:",
      result.transformerWarnings.join("\n")
    );
  }

  console.log(
    `✨ Generated registry with ${result.components.length} components`
  );
}

export async function generateRegistry(): Promise<void> {
  console.log("🔍 Scanning component directory...");

  try {
    const scanResult = await scanComponentDirectory();
    const template = generateTemplate(scanResult.components);

    const fileContent = [
      template.header.join("\n"),
      template.imports.join("\n"),
      template.registrations.join("\n"),
    ].join("\n\n");

    await writeFile(CONFIG.outputFile, fileContent, "utf-8");
    console.log(`📝 Registry file written to: ${CONFIG.outputFile}`);

    logScanResults(scanResult);
  } catch (error) {
    if (error instanceof CodegenError) {
      console.error("Failed to generate registry:", error.message);
      if (error.details) console.error("Details:", error.details);
    } else {
      console.error("Unexpected error:", error);
    }
    process.exit(1);
  }
}

generateRegistry().catch((error) => {
  console.error("Failed to generate registry:", error);
  process.exit(1);
});
