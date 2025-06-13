import { parse } from "path";
import type { ComponentInfo, Template } from "./types";
import { pathUtils } from "./paths";

export function capitalizeComponentName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function generateTemplate(components: ComponentInfo[]): Template {
  // TODO: currently this is coupled to inversify, consider making it more generic
  const template: Template = {
    header: [
      "// THIS FILE IS AUTO-GENERATED - DO NOT EDIT",
      `// Generated on: ${new Date().toISOString()}`,
      "",
    ],
    imports: [
      'import { widgetRegistryInversify } from "./widgetRegistry";',
      "",
    ],
    registrations: ["export { widgetRegistryInversify };", ""],
  };

  // Generate imports
  for (const component of components) {
    const componentName = capitalizeComponentName(component.name);
    const componentPath = pathUtils.getComponentImportPath(component.name);

    template.imports.push(`import ${componentName} from "${componentPath}";`);

    if (component.transformerPath) {
      const transformerFileName = parse(component.transformerPath).base;
      const transformerPath = pathUtils.getTransformerImportPath(
        component.name,
        transformerFileName
      );
      template.imports.push(
        `import ${component.name}Transformer from "${transformerPath}";`
      );
    }
  }

  // Generate registrations
  for (const component of components) {
    const componentName = capitalizeComponentName(component.name);
    template.registrations.push(
      `widgetRegistryInversify.registerComponent("${componentName}", {`,
      `  Component: ${componentName},`,
      component.transformerPath
        ? `  transformer: ${component.name}Transformer,`
        : "  transformer: (props) => props, // No transformer found, using identity function",
      "});"
    );
  }

  return template;
}
