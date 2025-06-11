import type { TextProps } from ".";

export interface TextPropsFromDataSource {
  text: string;
}

export default function transformer(props: Readonly<TextPropsFromDataSource>): TextProps {
  const { text } = props;

  return {
    children: text
  };
}
