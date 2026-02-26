import { cn } from "../../lib/utils"
import type { DeclaratieItem } from "../../types"

interface BadgeProps {
    status: DeclaratieItem["status"]
    className?: string
}

export function Badge({ status, className }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                {
                    "bg-gray-100 text-gray-800": status === "te-doen",
                    "bg-blue-100 text-blue-800": status === "bezig",
                    "bg-green-100 text-green-800": status === "gedaan",
                    "bg-red-100 text-red-800": status === "overgeslagen",
                },
                className
            )}
        >
            {status === "te-doen" && "Wachtrij"}
            {status === "bezig" && "Nu bezig"}
            {status === "gedaan" && "Ingevuld"}
            {status === "overgeslagen" && "Overgeslagen"}
        </span>
    )
}
