import { BookmarkIcon } from "lucide-react"

interface BookmarkletInstructieProps {
    url: string
}

export function BookmarkletInstructie({ url }: BookmarkletInstructieProps) {
    return (
        <div className="bg-cream/50 rounded-lg p-4 border border-cream text-sm">
            <h4 className="font-semibold flex items-center gap-2 mb-3">
                <BookmarkIcon className="w-4 h-4 text-accent" />
                Automatisch invullen via Bookmarklet
            </h4>
            <ol className="list-decimal ml-5 space-y-2 text-muted-800">
                <li>
                    Sleep deze knop naar je bladwijzerbalk:{" "}
                    <a
                        href={url}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-ink text-paper rounded-full text-xs font-mono font-medium hover:bg-ink/90 transition-colors mx-1"
                        title="Sleep naar bladwijzerbalk"
                        onClick={(e) => {
                            e.preventDefault()
                            alert("Sleep deze knop naar je bladwijzerbalk, in plaats van erop te klikken.")
                        }}
                    >
                        MATT Invuller
                    </a>
                </li>
                <li>Open het declaratieformulier in MATT.</li>
                <li>Klik op de ("MATT Invuller") bladwijzer in je balk om de velden te vullen.</li>
                <li>Plak de gekopieerde Van/Naar adressen in de juiste velden (indien nodig).</li>
                <li>Klik op Indienen in MATT en markeer als gedaan hieronder.</li>
            </ol>
        </div>
    )
}
