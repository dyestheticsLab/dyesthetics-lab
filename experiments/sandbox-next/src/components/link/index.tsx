import type { ReactNode } from 'react';

export interface LinkProps {
  href: string;
  children: ReactNode;
}

export default function Link({ href, children }: Readonly<LinkProps>) {
  return (
    <a 
      href={href}
      className="text-blue-500 hover:text-blue-700 hover:underline"
    >
      {children}
    </a>
  );
}