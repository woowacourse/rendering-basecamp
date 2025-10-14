import React from "react";

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
}

export const Text = ({
  as: Component = "p",
  className = "",
  children,
  ...props
}: TextProps) => {
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};
