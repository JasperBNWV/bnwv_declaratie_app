import { type SelectHTMLAttributes, forwardRef } from "react"
import { cn } from "../../lib/utils"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, children, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1 w-full">
                {label && <label className="text-sm font-medium text-ink">{label}</label>}
                <select
                    ref={ref}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-red-500 focus-visible:ring-red-500",
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>
                {error && <span className="text-xs text-red-500">{error}</span>}
            </div>
        )
    }
)
Select.displayName = "Select"
