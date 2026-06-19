import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { controlFocus, controlHeight, controlSize } from "@/components/ui/styles"

const buttonVariants = cva(
  `${controlFocus} group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding whitespace-nowrap transition-all select-none cursor-pointer active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
  {
    variants: {
      variant: {
        default: "bg-btn-primary text-btn-primary-text font-semibold text-sm gap-2 hover:bg-btn-primary-hover",
        outline:
          "border-border bg-surface text-text-primary font-normal text-sm gap-2 hover:border-accent-green-dim hover:text-accent-green-dim aria-expanded:border-accent-green-dim aria-expanded:text-accent-green-dim aria-pressed:border-accent-green aria-pressed:bg-accent-green/12 aria-pressed:text-accent-green-dim",
        secondary:
          "border-accent-green-dim bg-accent-green/12 text-accent-green-dim font-normal text-sm gap-2 hover:text-accent-green aria-expanded:border-accent-green-dim aria-expanded:bg-accent-green/12 aria-expanded:text-accent-green-dim",
        ghost:
          "text-text-dim font-normal text-sm gap-2 hover:bg-surface-raised hover:text-text-primary aria-expanded:bg-surface-raised aria-expanded:text-text-primary dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive font-medium text-sm gap-2 hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary font-medium text-sm gap-2 underline-offset-4 hover:underline",
      },
      size: {
        default:
          "px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "px-2.5 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "px-0",
        "icon-xs": "px-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "px-0",
        "icon-lg": "px-0",
      },
    },
    compoundVariants: [
      { size: ["xs", "sm"], class: controlHeight.sm },
      { size: "default", class: controlHeight.md },
      { size: "lg", class: controlHeight.lg },
      { size: "icon-xs", class: controlSize.sm },
      { size: "icon-sm", class: controlSize.sm },
      { size: "icon", class: controlSize.md },
      { size: "icon-lg", class: controlSize.lg },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function CloseButton({
  className,
  "aria-label": ariaLabel = "Close",
  ...props
}: ButtonPrimitive.Props) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={ariaLabel}
      className={className}
      {...props}
    >
      <X />
    </Button>
  )
}

export { Button, CloseButton, buttonVariants }
