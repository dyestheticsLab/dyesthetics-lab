import { injectable } from "inversify";

export interface SlugIndex {
  getAvailableSlugs(): Promise<string[]> | string[];
}

export class MockSlugIndex implements SlugIndex {
   getAvailableSlugs(): Promise<string[]> | string[] {
    // TODO: Implement actual Mock fetch logic
    return [];
  }
}
