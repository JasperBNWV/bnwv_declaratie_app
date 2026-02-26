import { useWachtrijStore } from "../store/wachtrij"
import { DeclaratieWachtrij } from "../components/DeclaratieWachtrij"
import { ProgressBar } from "../components/ui/ProgressBar"
import { Button } from "../components/ui/Button"
import { Trash2, ListOrdered } from "lucide-react"

export function WachtrijPage() {
    const { items, voortgang, reset } = useWachtrijStore()
    const stats = voortgang()

    const handleReset = () => {
        if (window.confirm("Weet je zeker dat je de hele wachtrij wilt wissen? Dit kan niet ongedaan worden gemaakt.")) {
            reset()
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-cream pb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-ink mb-1 flex items-center gap-2">
                        <ListOrdered className="w-8 h-8 text-accent" /> Declaratie Wachtrij
                    </h1>
                    <p className="text-muted">
                        Hieronder zie je de afspraken die je hebt geselecteerd om te declareren. Deze wachtrij is gebonden aan je browser sessie.
                    </p>
                </div>

                {items.length > 0 && (
                    <div className="w-full md:w-64">
                        <ProgressBar gedaan={stats.gedaan} totaal={stats.totaal} />
                    </div>
                )}
            </div>

            <DeclaratieWachtrij />

            {items.length > 0 && (
                <div className="pt-8 flex justify-center mt-12 mb-24">
                    <Button variant="danger" size="sm" onClick={handleReset} className="flex gap-2">
                        <Trash2 className="w-4 h-4" /> Wachtrij Volledig Wissen
                    </Button>
                </div>
            )}
        </div>
    )
}
