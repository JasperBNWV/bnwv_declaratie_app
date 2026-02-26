import { type InputHTMLAttributes, forwardRef } from "react"
import { cn } from "../../lib/utils"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1 w-full">
                {label && <label className="text-sm font-medium text-ink">{label}</label>}
                <input
                    type={type}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-red-500 focus-visible:ring-red-500",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <span className="text-xs text-red-500">{error}</span>}
            </div>
        )
    }
)
Input.displayName = "Input"
