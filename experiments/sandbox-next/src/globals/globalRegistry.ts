
import { Container } from "inversify";

export const globalRegistry = new Container()

export const GET_PAGE_BY_SLUG = Symbol.for("getPageBySlug");

globalRegistry.bind(GET_PAGE_BY_SLUG)
  .toFactory(() => {
    return (slug: string) => {
      // TODO: Implement service to get page by slug

      console.log("🚀 ~ return ~ slug:", slug)

      return [
        { 
          contentType: "Button", 
          title: "DESDE SERVICE",
          slots: {
            icon: {
              contentType: "Icon",
              size: "20",
              color: "blue"
            }
          }
        }
      ];
    }
  });