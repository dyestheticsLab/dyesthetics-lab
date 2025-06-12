/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType, ReactElement } from "react";
import { DependencyContainer, Lifecycle } from "tsyringe";

import { globalRegistryTsyringe as container } from "@/globals/tsyringe/globalRegistry";

export type RegisterOptions<T extends (props: any) => ReactElement> = {
  Component: T
  transformer?: (props: any) => any;
};

export interface IWidgetRegistry {
  registerComponent<T extends (props: any) => ReactElement, R extends string>(
    name: R,
    options: RegisterOptions<T>
  ): this;
  get(name: string): DependencyContainer | undefined;
  getComponent<T extends boolean>(
    name: string,
    throwError?: T
  ): T extends true
    ? ReturnType<ReturnType<WidgetRegistryTSyringe["createFactoryHelper"]>>
    : ReturnType<ReturnType<WidgetRegistryTSyringe["createFactoryHelper"]>> | null | undefined;
}

type ComponentToken = `Component-${string}`;
type TransformerToken = `Transformer-${string}`;

export class WidgetRegistryTSyringe implements IWidgetRegistry {
  private readonly registry = new Map<string, DependencyContainer>();
  private readonly componentTokens = new Map<string, ComponentToken>();
  private readonly transformerTokens = new Map<string, TransformerToken>();

  constructor(private readonly parent: DependencyContainer = container) { }

  static createContainerRegistry(parent: DependencyContainer = container) {
    return new WidgetRegistryTSyringe(parent);
  }

  registerComponent<T extends (props: any) => ReactElement, R extends string>(
    name: R,
    { Component, transformer }: RegisterOptions<T>
  ) {
  
    const child = this.parent.createChildContainer();
  
    const componentToken: ComponentToken = `Component-${name}`;
    const transformerToken: TransformerToken = `Transformer-${name}`;
  
    this.componentTokens.set(name, componentToken);
    this.transformerTokens.set(name, transformerToken);
    
    child.register(transformerToken, {
      useValue: transformer
    });

    const factory = this.createFactoryHelper(Component, transformerToken);
    
    child.register(componentToken, {
      useFactory: () => factory(child),
      lifecycle: Lifecycle.Transient
    });

    this.registry.set(name, child);

    return this;
  }

  get(name: string): DependencyContainer | undefined {
    return this.registry.get(name);
  }

  getComponent<T extends boolean>(
    name: string,
    throwError: T = false as T
  ): T extends true 
    ? ReturnType<ReturnType<typeof this.createFactoryHelper>> 
    : ReturnType<ReturnType<typeof this.createFactoryHelper>> | null | undefined {
    
    const childContainer = this.registry.get(name);
    const componentToken = this.componentTokens.get(name);

    if (throwError && (!childContainer || !componentToken)) {
      throw new Error(`Component ${name} not found`);
    }

    if (!childContainer || !componentToken) {
      return null as any;
    }

    try {
      return childContainer.resolve(componentToken) as any;
    } catch (error) {
      if (throwError) {
        throw new Error(`Failed to resolve component ${name}: ${error}`);
      }
      return null as any;
    }
  }

  private createFactoryHelper(
    Component: ComponentType, 
    transformerToken: TransformerToken
  ) {
    return (childContainer: DependencyContainer) => {
  
      const transformer: (props: unknown, container: DependencyContainer) => unknown = 
        childContainer.isRegistered(transformerToken) 
          ? childContainer.resolve(transformerToken) ?? ((props: unknown) => props)
          : ((props: unknown) => props);

      return async function CreatedComponent(rawProps: unknown) {
        const props = await transformer(rawProps, childContainer);

        return <Component {...props as any} />;
      };
    };
  }

  unregisterComponent(name: string): boolean {
    const childContainer = this.registry.get(name);
    
    if (childContainer) {
  
      this.registry.delete(name);
      this.componentTokens.delete(name);
      this.transformerTokens.delete(name);
      
      return true;
    }
    
    return false;
  }

  getRegisteredNames(): string[] {
    return Array.from(this.registry.keys());
  }

  isRegistered(name: string): boolean {
    return this.registry.has(name);
  }
}