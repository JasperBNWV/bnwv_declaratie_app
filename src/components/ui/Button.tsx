import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "../../lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "danger" | "ghost"
    size?: "sm" | "md" | "lg"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-accent text-white hover:bg-accent-hover": variant === "primary",
                        "bg-ink text-paper hover:bg-ink/90": variant === "secondary",
                        "border border-ink/20 bg-transparent hover:bg-ink/5": variant === "outline",
                        "bg-red-600 text-white hover:bg-red-700": variant === "danger",
                        "hover:bg-ink/5": variant === "ghost",
                        "h-8 px-3 text-sm": size === "sm",
                        "h-10 px-4 py-2": size === "md",
                        "h-12 px-8 text-lg": size === "lg",
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"
