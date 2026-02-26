import { useState, useEffect, useMemo } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAfspraken } from "../hooks/useAfspraken"
import { useWachtrijStore } from "../store/wachtrij"
import { useInstellingenStore } from "../store/instellingen"
import { afspraakNaarDeclaratie } from "../lib/declaratie"
import type { Afspraak } from "../types"
import { ErrorBanner } from "../components/ui/ErrorBanner"
import { Button } from "../components/ui/Button"
import { AfspraakKaart } from "../components/AfspraakKaart"
import { Calendar, Search, Activity, CornerUpRight } from "lucide-react"

export function AgendaPage() {
    const { fetchAfspraken, fout, laden } = useAfspraken()
    const wachtrijStore = useWachtrijStore()
    const instellingenStore = useInstellingenStore()
    const navigate = useNavigate()

    const [dateRange, setDateRange] = useState({
        van: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().substring(0, 10),
        tot: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().substring(0, 10)
    })

    // Gebruik een expliciete array zodat we die niet kwijtraken bij een render
    const [afspraken, setAfspraken] = useState<Afspraak[]>([])
    const [geselecteerd, setGeselecteerd] = useState<Set<string>>(new Set())

    // Check if settings are missing
    const ontbrekendeInstellingen = !instellingenStore.thuisadres || instellingenStore.vestigingen.length === 0

    const haalOp = async () => {
        // Einde van de dag voor \`tot\`
        const toDate = new Date(dateRange.tot)
        toDate.setHours(23, 59, 59)

        // Begin van de dag voor \`van\`
        const fromDate = new Date(dateRange.van)
        fromDate.setHours(0, 0, 0)

        const data = await fetchAfspraken(fromDate.toISOString(), toDate.toISOString())
        setAfspraken(data)
    }

    // Haal op bij eerste render (indien instellingen compleet zijn)
    useEffect(() => {
        if (!ontbrekendeInstellingen) {
            haalOp()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const toggleAfspraak = (id: string) => {
        setGeselecteerd((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const voegToeAanWachtrij = () => {
        if (ontbrekendeInstellingen) return

        const geselecteerdeAfspraken = afspraken.filter(a => geselecteerd.has(a.id))
        if (geselecteerdeAfspraken.length === 0) return

        const standaardVestiging = instellingenStore.vestigingen.find(
            v => v.id === instellingenStore.standaardVestigingId
        ) || instellingenStore.vestigingen[0]

        const nieuweItems = geselecteerdeAfspraken.map(afspraak => afspraakNaarDeclaratie(
            afspraak,
            {
                thuisadres: instellingenStore.thuisadres,
                standaardVestiging,
                standaardSoort: instellingenStore.standaardSoort,
                standaardRetour: instellingenStore.standaardRetour
            }
        ))

        wachtrijStore.voegToe(nieuweItems)
        navigate("/wachtrij")
    }

    // Filter afspraken die al in de wachtrij staan voor styling
    const wachtrijIds = useMemo(() => new Set(wachtrijStore.items.map(i => i.afspraakId)), [wachtrijStore.items])

    if (ontbrekendeInstellingen) {
        return (
            <div className="max-w-2xl mx-auto mt-12 text-center bg-white p-8 rounded-lg shadow-sm border border-cream">
                <Activity className="w-12 h-12 text-accent mx-auto mb-4" />
                <h2 className="text-2xl font-serif font-bold text-ink mb-2">Instellingen ontbreken</h2>
                <p className="text-muted mb-6">Voordat je agenda-afspraken kunt laden, dien je eerst je basisgegevens (zoals thuis- en vestigingsadres) in te vullen.</p>
                <Link to="/instellingen">
                    <Button variant="primary">Ga naar Instellingen</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-ink mb-1 flex items-center gap-2">
                        <Calendar className="w-8 h-8 text-accent" /> Jouw Agenda
                    </h1>
                    <p className="text-muted">Selecteer de afspraken waarvoor je reiskosten wilt declareren.</p>
                </div>

                <div className="flex gap-2 items-center bg-white p-2 rounded-lg border border-cream shadow-sm">
                    <input
                        type="date"
                        value={dateRange.van}
                        onChange={(e) => setDateRange(r => ({ ...r, van: e.target.value }))}
                        className="px-2 py-1 text-sm border-0 focus:ring-0 bg-transparent text-ink"
                    />
                    <span className="text-muted">tot</span>
                    <input
                        type="date"
                        value={dateRange.tot}
                        onChange={(e) => setDateRange(r => ({ ...r, tot: e.target.value }))}
                        className="px-2 py-1 text-sm border-0 focus:ring-0 bg-transparent text-ink"
                    />
                    <Button size="sm" onClick={haalOp} disabled={laden} className="ml-2 px-3">
                        <Search className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {fout && <ErrorBanner message={fout} onRetry={haalOp} />}

            <div className="bg-white rounded-xl shadow-sm border border-cream overflow-hidden">
                {/* Bulk actie balk (zichtbaar als er items geselecteerd zijn) */}
                {geselecteerd.size > 0 && (
                    <div className="bg-accent/10 border-b border-accent/20 px-6 py-3 flex items-center justify-between animate-in slide-in-from-top-2">
                        <span className="font-medium text-accent">
                            {geselecteerd.size} afspraak(en) geselecteerd
                        </span>
                        <Button onClick={voegToeAanWachtrij} data-testid="wachtrij-toevoegen" className="gap-2 shadow-sm">
                            Voeg {geselecteerd.size} toe aan wachtrij
                            <CornerUpRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                <div className="p-6">
                    {laden ? (
                        <div className="py-16 text-center text-muted">Aan het laden uit Microsoft 365...</div>
                    ) : afspraken.length === 0 ? (
                        <div className="py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium font-mono text-sm">Geen afspraken gevonden voor deze periode.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {afspraken.map((afspraak, index) => {
                                const inWachtrij = wachtrijIds.has(afspraak.id)
                                return (
                                    <AfspraakKaart
                                        key={afspraak.id}
                                        index={index}
                                        afspraak={afspraak}
                                        geselecteerd={geselecteerd.has(afspraak.id)}
                                        inWachtrij={inWachtrij}
                                        onToggle={toggleAfspraak}
                                    />
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
