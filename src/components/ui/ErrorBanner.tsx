import { AlertCircle } from "lucide-react"
import { Button } from "./Button"

interface ErrorBannerProps {
    message: string
    onRetry?: () => void
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
    return (
        <div className="flex items-center justify-between p-4 mb-4 text-red-800 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm font-medium">{message}</p>
            </div>
            {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry} className="border-red-200 hover:bg-red-100 text-red-700">
                    Opnieuw proberen
                </Button>
            )}
        </div>
    )
}
