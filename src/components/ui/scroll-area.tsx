import { forwardRef } from "preact/compat"
import type { ComponentChildren } from "preact"

type Style = Record<string, string | number>

const rootStyles = {
  position: "relative",
  overflow: "auto",
} satisfies Style

type ScrollAreaProps = {
  children: ComponentChildren
  style?: Style
}

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ style, children }, ref) => (
    <div ref={ref} style={{ ...rootStyles, ...style }}>
      {children}
    </div>
  )
)
ScrollArea.displayName = "ScrollArea"

const ScrollBar = forwardRef<HTMLDivElement, { style?: Style }>(
  ({ style }, ref) => <div ref={ref} style={style} />
)
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
