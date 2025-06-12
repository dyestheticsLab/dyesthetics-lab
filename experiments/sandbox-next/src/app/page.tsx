/* eslint-disable @typescript-eslint/no-explicit-any */
import { widgetRegistryInversify } from "@/globals/componentRegistry";
import { globalRegistry } from "@/globals/globalRegistry";
import { MockPageDataSource, PageDataSource } from "@/services/MockPageDataSource";

// TODO: Implement process to get slug

export default async function Home() {

  const slug = 'home'

  const { widgets } = await globalRegistry.get<PageDataSource>(MockPageDataSource).getPageBySlug(slug);

  return (
    <div>
      {
        widgets.map((widget: any, index: number) => {
          const { contentType, props } = widget;
          const Component = widgetRegistryInversify.getComponent(contentType);

          // TODO: SOPORTAR RECURSIVIDAD
          return <Component key={index} {...props} />
        })
      }
    </div>
  );
}
