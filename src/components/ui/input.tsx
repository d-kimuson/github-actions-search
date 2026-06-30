import { forwardRef } from "preact/compat"

type Style = Record<string, string | number>

const baseStyles = {
  display: "flex",
  height: "36px",
  width: "100%",
  borderRadius: "6px",
  border: "1px solid var(--input)",
  backgroundColor: "transparent",
  padding: "4px 12px",
  fontSize: "16px",
  boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  transition: "colors 200ms ease-in-out",
} satisfies Style

type InputProps = {
  onValueInput?: (value: string) => void
  placeholder?: string
  style?: Style
  type?: string
  value?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ onValueInput, placeholder, style, type, value }, ref) => {
    return (
      <input
        onInput={(event) => {
          onValueInput?.(event.currentTarget.value)
        }}
        placeholder={placeholder}
        ref={ref}
        style={{ ...baseStyles, ...style }}
        type={type}
        value={value}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
