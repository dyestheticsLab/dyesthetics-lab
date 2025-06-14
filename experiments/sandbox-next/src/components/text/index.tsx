import type { ReactNode } from "react";

export interface TextProps {
  children: ReactNode;
}

export default function Text({ children }: Readonly<TextProps>) {
  return <span className="text-amber-200">{children}</span>;
}
