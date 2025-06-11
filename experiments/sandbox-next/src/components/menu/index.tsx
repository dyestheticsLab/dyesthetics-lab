import type { ReactNode } from "react";

export interface MenuItem {
  type: 'span' | 'anchor';
  text: string;
  children?: MenuItem[];
}

export interface MenuProps {
  items: MenuItem[];
}

export default function Menu({ items }: Readonly<MenuProps>) {
  const renderMenuItem = (item: MenuItem): ReactNode => {
    const children = item.children?.map((child) => renderMenuItem(child));
    
    return (
      <li key={item.text} className="ml-4">
        {item.type === 'anchor' ? (
          <button 
            className="text-blue-500 hover:underline"
          >
            {item.text}
          </button>
        ) : (
          <span>{item.text}</span>
        )}
        {children && children.length > 0 && (
          <ul>{children}</ul>
        )}
      </li>
    );
  };

  return (
    <nav className="w-fit p-4 border border-amber-200 rounded shadow">
      <ul>
        {items.map(renderMenuItem)}
      </ul>
    </nav>
  );
}