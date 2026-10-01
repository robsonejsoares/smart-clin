import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-base text-foreground shadow-sm shadow-black/[0.025] outline-none transition-[border-color,box-shadow,background-color,transform] duration-200 ease-out placeholder:text-muted-foreground/80 hover:border-border focus-visible:border-[#252579]/45 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-[#252579]/15 focus-visible:ring-offset-0 focus-visible:shadow-[0_0_0_1px_rgba(37,37,121,0.08),0_4px_14px_rgba(37,37,121,0.06)] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border/70 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
