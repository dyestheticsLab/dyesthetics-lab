# Next.js CMS Component Registry

This project demonstrates a flexible component registry system using Inversify for dependency injection in Next.js. It allows dynamic rendering of CMS-driven components with support for nested structures.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

The project uses a component registry system with the following key concepts:

### CMS Widget Structure
Components are defined in the CMS as widgets with a standard structure:
```typescript
interface CMSWidget {
  contentType: string;  // Type of the component (e.g., "Menu", "Text", "Link")
  children?: CMSWidget[]; // Optional nested components
  [key: string]: unknown; // Additional props specific to each component
}
```

Example of a nested structure:
```typescript
{
  contentType: "Menu",
  items: [
    {
      contentType: "Text",
      text: "Main Menu",
      children: [
        {
          contentType: "Link",
          url: "/home",
          text: "Home"
        }
      ]
    }
  ]
}
```

### Component Registry
Components are registered using `widgetRegistryInversify` which:
- Manages component registration and resolution
- Handles component transformations
- Supports nested component structures

## Creating a New Component

To create a new component, follow these steps:

1. Create Component Files:
   ```
   src/components/your-component/
   ├── index.tsx         # Component implementation
   └── transformer.tsx   # Data transformer
   ```

2. Implement Component:
   ```tsx
   // index.tsx
   export interface YourComponentProps {
     // Define your props
   }

   export default function YourComponent(props: Readonly<YourComponentProps>) {
     // Implement your component
   }
   ```

3. Create Transformer:
   ```tsx
   // transformer.tsx
   import type { YourComponentProps } from ".";

   export interface YourComponentPropsFromDataSource {
     // Define CMS data structure
   }

   export default function transformer(
     props: Readonly<YourComponentPropsFromDataSource>
   ): YourComponentProps {
     // Transform CMS data to component props
   }
   ```

4. Register Component:
   ```tsx
   // src/globals/componentRegistry.ts
   import YourComponent from "../components/your-component";
   import transformer from "../components/your-component/transformer";

   widgetRegistryInversify.registerComponent(
     "YourComponent",
     { Component: YourComponent, transformer }
   );
   ```

## Component Examples

The project includes several example components:

- **Menu**: Demonstrates recursive component rendering
- **Text**: Simple text display component
- **Link**: Basic link component
- **Button**: Basic button component

Each component follows the same pattern of component + transformer, making the system easily extensible.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [InversifyJS Documentation](https://inversify.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
