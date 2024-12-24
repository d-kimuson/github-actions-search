import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

const rootStyles: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
};

const viewportStyles: React.CSSProperties = {
  height: "100%",
  width: "100%",
  borderRadius: "inherit",
};

const getScrollbarStyles = (orientation: "vertical" | "horizontal") => ({
  display: "flex",
  touchAction: "none",
  userSelect: "none" as const,
  transition: "colors 200ms ease-in-out",
  ...(orientation === "vertical"
    ? {
        height: "100%",
        width: "10px",
        borderLeft: "1px solid transparent",
        padding: "1px",
      }
    : {
        height: "10px",
        flexDirection: "column" as const,
        borderTop: "1px solid transparent",
        padding: "1px",
      }),
});

const thumbStyles: React.CSSProperties = {
  position: "relative",
  flex: 1,
  borderRadius: "9999px",
  backgroundColor: "var(--border)",
};

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ style, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    style={{ ...rootStyles, ...style }}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport style={viewportStyles}>
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ style, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    style={{ ...getScrollbarStyles(orientation), ...style }}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb style={thumbStyles} />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
