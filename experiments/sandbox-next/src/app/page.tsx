/* eslint-disable @typescript-eslint/no-explicit-any */
import { widgetRegistryInversify } from "@/globals/componentRegistry";
import { GET_PAGE_BY_SLUG, globalRegistryTsyringe as globalRegistry } from "@/globals/tsyringe/globalRegistry";

// TODO: Implement process to get slug

export default async function Home() {

  const slug = 'home'

  const getPageBySlug: any = globalRegistry.resolve(GET_PAGE_BY_SLUG)

  const widgets = getPageBySlug(slug)

  return (
    <div>
      {
        widgets.map((widget: any, index: number) => {
          const { contentType, ...props } = widget;

          const Component = widgetRegistryInversify.getComponent(contentType);

          // TODO: SOPORTAR RECURSIVIDAD
          return <Component key={index} {...props} />
        })
      }
    </div>
  );
}
