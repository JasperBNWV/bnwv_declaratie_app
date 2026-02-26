import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "./Button"

interface ClipboardButtonProps {
    text: string
    className?: string
}

export function ClipboardButton({ text, className }: ClipboardButtonProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy text: ", err)
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className={className}
            onClick={handleCopy}
            title="Kopieer naar klembord"
            type="button"
        >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
        </Button>
    )
}
