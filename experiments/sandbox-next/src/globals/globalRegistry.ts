import type { CMSWidget } from "@/types/cms";
import { Container } from "inversify";

export const globalRegistry = new Container();

export const GET_PAGE_BY_SLUG = Symbol.for("getPageBySlug");

globalRegistry.bind(GET_PAGE_BY_SLUG).toFactory(() => {
  return async (slug: string): Promise<CMSWidget[]> => {
    console.log("🚀 ~ return ~ slug:", slug);

    return [
      {
        id: "main-menu",
        contentType: "Menu",
        items: [
          {
            id: "menu-root",
            contentType: "Text",
            text: "Main Menu",
            children: [
              {
                id: "menu-home",
                contentType: "Link",
                url: "/home",
                text: "Home",
              },
              {
                id: "menu-categories",
                contentType: "Text",
                text: "Categories",
                children: [
                  {
                    id: "menu-electronics",
                    contentType: "Link",
                    url: "/electronics",
                    text: "Electronics",
                  },
                  {
                    id: "menu-books",
                    contentType: "Link",
                    url: "/books",
                    text: "Books",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "main-button",
        contentType: "Button",
        title: "DESDE SERVICE",
      },
      {
        id: "main-text",
        contentType: "Text",
        text: "This is a test Text",
      },
      {
        id: "main-link",
        contentType: "Link",
        url: "#",
        text: "Test Link",
      },
    ];
  };
});
