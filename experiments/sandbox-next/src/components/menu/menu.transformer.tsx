import type { MenuProps } from ".";

export interface MenuItemFromDataSource {
  type: 'span' | 'anchor';
  text: string;
  children?: MenuItemFromDataSource[];
}

export interface MenuPropsFromDataSource {
  items: MenuItemFromDataSource[];
}

export default function transformer(props: Readonly<MenuPropsFromDataSource>): MenuProps {
  return props;
}