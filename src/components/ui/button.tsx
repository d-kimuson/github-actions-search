import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

const baseStyles = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  whiteSpace: "nowrap" as const,
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: 500,
  transition: "colors 200ms ease-in-out",
  "&:focus-visible": {
    outline: "none",
    ring: "1px solid var(--ring)",
  },
  "&:disabled": {
    pointerEvents: "none",
    opacity: 0.5,
  },
  "& svg": {
    pointerEvents: "none",
    width: "16px",
    height: "16px",
    flexShrink: 0,
  },
};

const variants = {
  default: {
    backgroundColor: "var(--primary)",
    color: "var(--primary-foreground)",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
    "&:hover": {
      backgroundColor: "rgba(var(--primary), 0.9)",
    },
  },
  destructive: {
    backgroundColor: "var(--destructive)",
    color: "var(--destructive-foreground)",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "&:hover": {
      backgroundColor: "rgba(var(--destructive), 0.9)",
    },
  },
  outline: {
    border: "1px solid var(--input)",
    backgroundColor: "var(--background)",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "&:hover": {
      backgroundColor: "var(--accent)",
      color: "var(--accent-foreground)",
    },
  },
  secondary: {
    backgroundColor: "var(--secondary)",
    color: "var(--secondary-foreground)",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "&:hover": {
      backgroundColor: "rgba(var(--secondary), 0.8)",
    },
  },
  ghost: {
    "&:hover": {
      backgroundColor: "var(--accent)",
      color: "var(--accent-foreground)",
    },
  },
  link: {
    color: "var(--primary)",
    textDecorationThickness: "4px",
    "&:hover": {
      textDecoration: "underline",
    },
  },
};

const sizes = {
  default: {
    height: "36px",
    padding: "8px 16px",
  },
  sm: {
    height: "32px",
    padding: "4px 12px",
    fontSize: "12px",
    borderRadius: "6px",
  },
  lg: {
    height: "40px",
    padding: "8px 32px",
    borderRadius: "6px",
  },
  icon: {
    height: "36px",
    width: "36px",
  },
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { style, variant = "default", size = "default", asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const combinedStyles = {
      ...baseStyles,
      ...variants[variant],
      ...sizes[size],
      ...style,
    };

    return <Comp style={combinedStyles} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, type ButtonProps };
