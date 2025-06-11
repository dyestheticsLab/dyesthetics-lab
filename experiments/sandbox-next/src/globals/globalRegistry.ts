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
          contentType: "Menu", 
          items: [
            {
              type: "span",
              text: "Main Menu",
              children: [
                {
                  type: "anchor",
                  text: "Home",
                },
                {
                  type: "span",
                  text: "Categories",
                  children: [
                    {
                      type: "anchor",
                      text: "Electronics",
                    },
                    {
                      type: "anchor",
                      text: "Books",
                    }
                  ]
                }
              ]
            }
          ]
        },
        { 
          contentType: "Button", 
          title: "DESDE SERVICE" 
        }
      ]
    }
  });