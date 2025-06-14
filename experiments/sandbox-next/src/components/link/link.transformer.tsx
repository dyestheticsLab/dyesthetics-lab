import type { LinkProps } from ".";

export interface LinkPropsFromDataSource {
  url: string;
  text: string;
}

export default function transformer(props: Readonly<LinkPropsFromDataSource>): LinkProps {
  const { url, text } = props;

  return {
    href: url,
    children: text
  };
}
