import type { ButtonProps } from ".";

export interface ButtonPropsFromDataSource {
  title?: string;
}
// TODO: RETHINK WHERE TO PLACE THIS KIND OF TRANSFORMERS
export default function transformer(props: Readonly<ButtonPropsFromDataSource>): ButtonProps {
  const { title } = props;

  return {
    text: <span>{title}</span>,
  };
}
