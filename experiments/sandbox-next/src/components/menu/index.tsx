import type { ReactNode } from "react";

export interface MenuItem {
  id: string;
  contentType: string;
  component: ReactNode;
  children?: MenuItem[];
}

export interface MenuProps {
  items: MenuItem[];
}

// TODO: abstraer la lógica de renderizado recursivo en un componente abstracto
export default function Menu({ items }: Readonly<MenuProps>) {
  const renderMenuItem = (item: MenuItem): ReactNode => {
    const children = item.children?.map((child) => renderMenuItem(child));

    return (
      <li key={item.id} className="ml-4">
        {item.component}
        {children && children.length > 0 && <ul>{children}</ul>}
      </li>
    );
  };

  return (
    <nav className="w-fit p-4 border border-amber-200 rounded shadow">
      <ul>{items.map(renderMenuItem)}</ul>
    </nav>
  );
}
