import type {
  ComponentInfo,
  CodegenConfig,
  ScanResult,
  PathUtils,
} from "../types";
import type { GeneratedTemplate } from "../types/template";
import { createPathUtils } from "../utils/paths";
import { registryPresets } from "../config/presets";

export class Template {
  private readonly template: GeneratedTemplate;

  constructor(scanResult: ScanResult, config: CodegenConfig) {
    this.template = this.createTemplate(scanResult.components, config);
    this.generateContent();
  }

  private createTemplate(
    components: ComponentInfo[],
    config: CodegenConfig
  ): GeneratedTemplate {
    return {
      header: this.generateHeader(),
      imports: this.generateImports(components, config),
      registrations: this.generateRegistrations(components, config),
    };
  }

  private generateHeader(): string[] {
    return [
      "// THIS FILE IS AUTO-GENERATED - DO NOT EDIT",
      `// Generated on: ${new Date().toISOString()}`,
    ];
  }

  private generateImports(
    components: ComponentInfo[],
    config: CodegenConfig
  ): string[] {
    const pathUtils = createPathUtils(config);
    const registryConfig = this.getRegistryConfig(config);
    const imports: string[] = [
      `import { ${registryConfig.importName} } from "${registryConfig.importPath}";`,
      "",
    ];

    for (const component of components) {
      imports.push(this.generateComponentImport(component, pathUtils));
      if (component.transformerPath) {
        imports.push(this.generateTransformerImport(component, pathUtils));
      }
    }

    return imports;
  }

  private generateComponentImport(
    component: ComponentInfo,
    pathUtils: PathUtils
  ): string {
    const componentName = this.capitalizeComponentName(component.name);
    return `import ${componentName} from "${pathUtils.getComponentImportPath(
      component.name
    )}";`;
  }

  private generateTransformerImport(
    component: ComponentInfo,
    pathUtils: PathUtils
  ): string {
    if (!component.transformerPath) {
      throw new Error("Transformer path is required but was undefined");
    }
    return `import ${
      component.name
    }Transformer from "${pathUtils.getTransformerImportPath(
      component.name,
      component.transformerPath
    )}";`;
  }

  private generateRegistrations(
    components: ComponentInfo[],
    config: CodegenConfig
  ): string[] {
    const registryConfig = this.getRegistryConfig(config);
    const registrations: string[] = [];

    for (const component of components) {
      const registration = this.generateComponentRegistration(
        component,
        registryConfig
      );
      registrations.push(...registration);
    }

    return registrations;
  }

  private getRegistryConfig(config: CodegenConfig) {
    const registryType = config.registry?.type ?? "inversify";
    const preset = registryPresets[registryType];
    return {
      importPath: config.registry?.importPath ?? preset.importPath,
      importName: config.registry?.importName ?? preset.importName,
    };
  }

  private generateComponentRegistration(
    component: ComponentInfo,
    registryConfig: { importPath: string; importName: string }
  ): string[] {
    const componentName = this.capitalizeComponentName(component.name);
    const componentWarning = this.getComponentWarning(component);
    const transformerLine = this.getTransformerLine(component);

    return [
      `${registryConfig.importName}.registerComponent("${componentName}", {`,
      `  Component: ${componentName},${componentWarning}`,
      transformerLine,
      "});",
    ];
  }

  private getComponentWarning(component: ComponentInfo): string {
    return component.validation?.componentValidation?.hasDefaultExport === false
      ? " // WARNING: Missing default export in component"
      : "";
  }

  private getTransformerLine(component: ComponentInfo): string {
    if (!component.transformerPath) {
      return "  transformer: (props) => props, // No transformer file, using identity function";
    }

    if (
      component.validation?.transformerValidation?.hasDefaultExport === false
    ) {
      return `  transformer: ${component.name}Transformer, // WARNING: Missing default export in transformer`;
    }

    return `  transformer: ${component.name}Transformer,`;
  }

  private generateContent(): void {
    const { header, imports, registrations } = this.template;
    this.template.content = [
      ...header,
      "",
      ...imports,
      "",
      ...registrations,
      "",
    ].join("\n");
  }

  private capitalizeComponentName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  toString(): string {
    return this.template.content ?? "";
  }
}
