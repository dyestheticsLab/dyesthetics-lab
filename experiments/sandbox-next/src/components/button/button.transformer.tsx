import type { ButtonProps } from ".";
import { WidgetRegistryInversify } from "@/services/WidgetRegistryInversify";

type Slots = {
  [key: string]: {
    contentType: string;
    [key: string]: any;
  };
};

export interface ButtonPropsFromDataSource {
  title?: string;
  slots: Slots;
}
// TODO: RETHINK WHERE TO PLACE THIS KIND OF TRANSFORMERS
export default function transformer(props: Readonly<ButtonPropsFromDataSource>, ctx: WidgetRegistryInversify): ButtonProps {
  const { title, slots } = props;

  // TODO: suppprt this get comoponents to multiple slots
  const Icon: any = ctx.getComponent(slots.icon.contentType);

  return {
    text: <span>{title}</span>,
    icon: <Icon {...slots.icon} />,
  };
}
