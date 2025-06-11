import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: ReactNode;
}

export default function Button(props: Readonly<ButtonProps>) {

  return (
    <button className="btn btn-primary">
      {props.text || "Click me"}
    </button>
  )
}