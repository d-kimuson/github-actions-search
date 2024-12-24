import * as React from "react";

const baseStyles = {
  flex: "flex",
  height: "36px",
  width: "100%",
  borderRadius: "6px",
  border: "1px solid var(--input)",
  backgroundColor: "transparent",
  paddingX: "12px",
  paddingY: "4px",
  fontSize: "16px",
  boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  transition: "colors 200ms ease-in-out",
  "&::file": {
    border: 0,
    backgroundColor: "transparent",
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--foreground)",
  },
  "&::placeholder": {
    color: "var(--muted-foreground)",
  },
  "&:focus-visible": {
    outline: "none",
    ringWidth: "1px",
    ring: "var(--ring)",
  },
  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.5,
  },
  "@media (min-width: 768px)": {
    fontSize: "14px",
  },
};

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ style, type, ...props }, ref) => {
    return (
      <input
        type={type}
        style={{ ...baseStyles, ...style }}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
