import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#252579] text-white shadow-sm shadow-[#252579]/15 hover:-translate-y-px hover:bg-[#2d2d8f] hover:shadow-md hover:shadow-[#252579]/20 active:translate-y-0 active:shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm shadow-destructive/15 hover:-translate-y-px hover:bg-destructive/90 hover:shadow-md hover:shadow-destructive/20 active:translate-y-0 active:shadow-sm",
        outline:
          "border border-border/80 bg-background text-foreground shadow-sm hover:-translate-y-px hover:border-[#252579]/25 hover:bg-[#252579]/[0.035] hover:text-[#252579] hover:shadow-md hover:shadow-[#252579]/10 active:translate-y-0 active:shadow-sm",
        secondary:
          "border border-emerald-500/15 bg-emerald-500/[0.07] text-emerald-700 shadow-sm shadow-emerald-500/5 hover:-translate-y-px hover:border-emerald-500/25 hover:bg-emerald-500/10 hover:shadow-md hover:shadow-emerald-500/10 active:translate-y-0 active:shadow-sm dark:text-emerald-400",
        ghost:
          "text-muted-foreground hover:bg-[#252579]/[0.055] hover:text-[#252579] active:bg-[#252579]/[0.09] dark:hover:bg-[#252579]/10 dark:hover:text-white",
        link:
          "rounded-md px-1 text-[#252579] underline-offset-4 hover:text-[#2d2d8f] hover:underline dark:text-indigo-300 dark:hover:text-indigo-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"


    if (loading && asChild) {
      return (
        <button
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled
          aria-busy="true"
          {...props}
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando...</span>
        </button>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Carregando...</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )


  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
