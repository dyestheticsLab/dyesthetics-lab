import { PageData } from "../interfaces/page";

export interface PageDataSource {
  getPageBySlug(slug: string): Promise<PageData> | PageData;
}

export class MockPageDataSource implements PageDataSource{
   getPageBySlug(slug:string): Promise<PageData> {
    // TODO: Implement actual Mock fetch logic
    return new Promise((resolve) => {
      resolve({
        widgets: [],
        floatWidgets: [],
        preload: [],
      });
    }
  );
  }
}
