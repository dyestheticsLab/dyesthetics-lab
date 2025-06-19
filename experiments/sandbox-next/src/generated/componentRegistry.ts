// THIS FILE IS AUTO-GENERATED - DO NOT EDIT
// Generated on: 2025-06-19T23:16:47.941Z

import { componentRegistry } from "./services/registry";

import Button from "../components/button";
import buttonTransformer from "../components/button/button.transformer";
import ComponentWithEmptyTransformer from "../components/componentWithEmptyTransformer";
import componentWithEmptyTransformerTransformer from "../components/componentWithEmptyTransformer/transformer";
import ComponentWithoutTransformer from "../components/componentWithoutTransformer";

componentRegistry.registerComponent("Button", {
  Component: Button,
  transformer: buttonTransformer,
});
componentRegistry.registerComponent("ComponentWithEmptyTransformer", {
  Component: ComponentWithEmptyTransformer, // WARNING: Missing default export in component
  transformer: componentWithEmptyTransformerTransformer, // WARNING: Missing default export in transformer
});
componentRegistry.registerComponent("ComponentWithoutTransformer", {
  Component: ComponentWithoutTransformer, // WARNING: Missing default export in component
  transformer: (props) => props, // No transformer file, using identity function
});
