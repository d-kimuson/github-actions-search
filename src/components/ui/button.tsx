import { forwardRef } from "preact/compat"
import type { ComponentChildren } from "preact"
import { colors } from "@/content/theme"

type Style = Record<string, string | number>

const baseStyles = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  whiteSpace: "nowrap",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: 500,
  transition: "colors 200ms ease-in-out",
} satisfies Style

const variants = {
  default: {
    backgroundColor: colors.buttonBackgroundColor,
    color: colors.textColor,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
    borderColor: colors.buttonBorderColor,
    borderWidth: "1px",
  },
} satisfies Record<string, Style>

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
} satisfies Record<string, Style>

type ButtonProps = {
  "aria-busy"?: boolean
  "aria-label"?: string
  children?: ComponentChildren
  onClick?: () => void
  size?: keyof typeof sizes
  style?: Style
  variant?: keyof typeof variants
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      "aria-busy": ariaBusy,
      "aria-label": ariaLabel,
      children,
      onClick,
      style,
      variant = "default",
      size = "default",
    },
    ref
  ) => {
    const combinedStyles = {
      ...baseStyles,
      ...variants[variant],
      ...sizes[size],
      ...style,
    }

    return (
      <button
        aria-busy={ariaBusy}
        aria-label={ariaLabel}
        onClick={onClick}
        ref={ref}
        style={combinedStyles}
        type="button"
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, type ButtonProps }
