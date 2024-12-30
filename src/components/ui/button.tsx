import { Slot } from "@radix-ui/react-slot"
import * as React from "react"
import { colors } from "@/content/theme"

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
}

const variants = {
  default: {
    backgroundColor: colors.buttonBackgroundColor,
    color: colors.textColor,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
    "&:hover": {
      backgroundColor: `rgba(${colors.buttonBackgroundColor}, 0.9)`,
    },
    borderColor: colors.buttonBorderColor,
    borderWidth: "1px",
  },
}

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
} satisfies Record<string, React.CSSProperties>

type ButtonProps = {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  asChild?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { style, variant = "default", size = "default", asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const combinedStyles = {
      ...baseStyles,
      ...variants[variant],
      ...sizes[size],
      ...style,
    }

    return <Comp style={combinedStyles} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, type ButtonProps }
