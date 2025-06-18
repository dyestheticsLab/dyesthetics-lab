import { widgetRegistryInversify } from "@/globals/componentRegistry";
import { GET_PAGE_BY_SLUG, globalRegistry } from "@/globals/globalRegistry";
import type { CMSWidget } from "@/types/cms";

export default async function Home() {
  const slug = "home";
  const getPageBySlug =
    globalRegistry.get<(slug: string) => Promise<CMSWidget[]>>(
      GET_PAGE_BY_SLUG
    );
  const widgets = await getPageBySlug(slug);

  return (
    <div>
      {widgets.map((widget) => {
        const { contentType, ...props } = widget;
        const Component = widgetRegistryInversify.getComponent(
          contentType,
          true
        );

        return <Component key={widget.id} {...props} />;
      })}
    </div>
  );
}
