import { widgetRegistryInversify } from "@/globals/componentRegistry";
import type { CMSWidget } from "@/types/cms";
import type { MenuItem, MenuProps } from ".";

export default async function transformer(
  widget: Readonly<CMSWidget>,
): Promise<MenuProps> {
  const transformItems = async (items: CMSWidget[]): Promise<MenuItem[]> => {
    return Promise.all(
      items.map(async (item) => {
        const Component = widgetRegistryInversify.getComponent(
          item.contentType,
          true
        );
        const children = item.children
          ? await transformItems(item.children)
          : undefined;

        return {
          id: item.id,
          contentType: item.contentType,
          component: <Component key={item.id} {...item} />,
          children,
        };
      })
    );
  };

  return {
    items: await transformItems(widget.items as CMSWidget[]),
  };
}

// TODO: Evitar que haya desbordamiento de pila (stack overflow). Podría usarse trampoline?
// TODO: Desacoplar la implementación del inversor de control (no llamar directo a widgetRegistryInversify)
// TODO: Abstraer estructura recursiva cuando ya esté definida la manera correcta de resolver recursivamente. Tal vez una función?
