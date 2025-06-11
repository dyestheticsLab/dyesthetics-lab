import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: ReactNode;
  icon?: ReactNode;
}

export default function Button({
  text,
  icon,
  children,
  ...props
}: Readonly<ButtonProps>) {
  
  return (
    <button className="btn btn-primary" {...props}>

      {icon && (
        <span className="inline-flex items-center mr-2">
          {icon}
        </span>
      )}
      
      {text || "Click me"}
    </button>
  )
}