import type { ReactNode } from 'react';

export interface TextProps {
  children: ReactNode;
}

export default function Text({ children }: Readonly<TextProps>) {
  return (
    <span className="text-gray-700">
      {children}
    </span>
  );
}
