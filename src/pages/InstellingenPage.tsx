import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { useInstellingenStore } from "../store/instellingen"
import type { DeclaratieItem, Vestiging } from "../types"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Select } from "../components/ui/Select"
import { X, Plus, Save } from "lucide-react"

export function InstellingenPage() {
    const store = useInstellingenStore()
    const navigate = useNavigate()

    // Formulier state, lokaal vasthouden totdat we op opslaan klikken
    const [thuisadres, setThuisadres] = useState(store.thuisadres)
    const [vestigingen, setVestigingen] = useState<Vestiging[]>(
        store.vestigingen.length > 0 ? [...store.vestigingen] : [{ id: uuidv4(), naam: "", adres: "" }]
    )
    const [standaardSoort, setStandaardSoort] = useState(store.standaardSoort)
    const [standaardRetour, setStandaardRetour] = useState(store.standaardRetour)
    const [standaardVestigingId, setStandaardVestigingId] = useState(store.standaardVestigingId)

    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleVoegVestigingToe = () => {
        if (vestigingen.length < 5) {
            setVestigingen([...vestigingen, { id: uuidv4(), naam: "", adres: "" }])
        }
    }

    const handleVerwijderVestiging = (id: string) => {
        if (vestigingen.length > 1) {
            setVestigingen(vestigingen.filter((v) => v.id !== id))
            if (standaardVestigingId === id) {
                setStandaardVestigingId(null)
            }
        }
    }

    const handleVestigingWijziging = (id: string, veld: "naam" | "adres", waarde: string) => {
        setVestigingen(
            vestigingen.map((v) => (v.id === id ? { ...v, [veld]: waarde } : v))
        )
    }

    const handleOpslaan = () => {
        const nieuweFouten: Record<string, string> = {}

        if (!thuisadres.trim()) {
            nieuweFouten.thuisadres = "Thuisadres is verplicht"
        }

        // Filter lege vestigingen
        const geldigeVestigingen = vestigingen.filter((v) => v.naam.trim() !== "" && v.adres.trim() !== "")

        if (geldigeVestigingen.length === 0) {
            nieuweFouten.vestigingen = "Minimaal 1 vestiging (met naam en adres) is verplicht"
        }

        if (Object.keys(nieuweFouten).length > 0) {
            setErrors(nieuweFouten)
            return
        }

        // Welke standaard vestiging? Val terug op eerste of degene die gekozen is.
        let defId = standaardVestigingId
        if (!standaardVestigingId || !geldigeVestigingen.find((v) => v.id === standaardVestigingId)) {
            defId = geldigeVestigingen[0].id
        }

        store.slaOp({
            thuisadres,
            vestigingen: geldigeVestigingen,
            standaardSoort,
            standaardRetour,
            standaardVestigingId: defId,
        })

        navigate("/agenda")
    }

    const ontbrekendeInstellingen = !store.thuisadres || store.vestigingen.length === 0

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-ink mb-2">Instellingen</h1>
                <p className="text-muted">
                    Pas hier je voorkeuren en adresgegevens aan. Deze worden automatisch ingevuld bij nieuwe declaraties.
                    Je gegevens worden veilig opgeslagen in je browser (localStorage).
                </p>
            </div>

            {ontbrekendeInstellingen && (
                <div className="p-4 bg-accent/10 border border-accent rounded-lg text-accent text-sm font-medium">
                    Vul hieronder minimaal je thuisadres in en voeg minstens 1 vestiging toe om van start te gaan!
                </div>
            )}

            <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-cream">
                <section>
                    <h2 className="text-lg font-semibold border-b border-cream pb-2 mb-4">Basisgegevens</h2>
                    <Input
                        label="Mijn Thuisadres"
                        placeholder="bijv. Houtweg 127, 2511CH Den Haag"
                        value={thuisadres}
                        onChange={(e) => {
                            setThuisadres(e.target.value)
                            if (errors.thuisadres) setErrors({ ...errors, thuisadres: "" })
                        }}
                        error={errors.thuisadres}
                        data-testid="thuisadres"
                    />
                </section>

                <section>
                    <div className="flex justify-between items-center border-b border-cream pb-2 mb-4">
                        <h2 className="text-lg font-semibold">Vestigingen ({vestigingen.length}/5)</h2>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleVoegVestigingToe}
                            disabled={vestigingen.length >= 5}
                            data-testid="vestiging-toevoegen"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Toevoegen
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {vestigingen.map((vestiging, index) => (
                            <div key={vestiging.id} className="flex items-start gap-4 p-4 border rounded-md relative bg-gray-50/50">
                                <div className="flex-1 space-y-3">
                                    <Input
                                        label="Naam vestiging"
                                        placeholder="bijv. Gouda, Den Haag of Amsterdam"
                                        value={vestiging.naam}
                                        onChange={(e) => handleVestigingWijziging(vestiging.id, "naam", e.target.value)}
                                        data-testid={`vestiging-naam-${index}`}
                                    />
                                    <Input
                                        label="Volledig Adres"
                                        placeholder="bijv. Blekerssingel 41, 2806 CB Gouda"
                                        value={vestiging.adres}
                                        onChange={(e) => handleVestigingWijziging(vestiging.id, "adres", e.target.value)}
                                        data-testid={`vestiging-adres-${index}`}
                                    />
                                </div>
                                {vestigingen.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleVerwijderVestiging(vestiging.id)}
                                        title="Verwijder"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        {errors.vestigingen && <p className="text-red-500 text-sm mt-1">{errors.vestigingen}</p>}
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-semibold border-b border-cream pb-2 mb-4">Standaard Waarden</h2>
                    <div className="space-y-4">
                        <Select
                            label="Standaard Doel (Bestemming)"
                            value={standaardVestigingId || ""}
                            onChange={(e) => setStandaardVestigingId(e.target.value)}
                        >
                            <option value="" disabled>Selecteer je voorkeursvestiging</option>
                            {vestigingen.map((v) => v.naam ? (
                                <option key={v.id} value={v.id}>{v.naam}</option>
                            ) : null)}
                        </Select>

                        <Select
                            label="Standaard Declaratietype"
                            value={standaardSoort}
                            onChange={(e) => setStandaardSoort(e.target.value as DeclaratieItem["soort"])}
                        >
                            <option value="1">Woon/werk reiskosten - met een ander vervoersmiddel</option>
                            <option value="2">Zakelijke reiskosten - via app gereserveerd / ov kaart</option>
                            <option value="3">Zakelijke reiskosten - overig auto</option>
                            <option value="4">Zakelijke reiskosten - overig fiets of ov</option>
                            <option value="5">Zakelijke reiskosten - overig openbaar vervoer</option>
                        </Select>

                        <label className="flex items-center gap-2 cursor-pointer mt-4 font-medium text-sm">
                            <input
                                type="checkbox"
                                checked={standaardRetour}
                                onChange={(e) => setStandaardRetour(e.target.checked)}
                                className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                            />
                            Altijd checken voor 'Retour' (heen en terug)
                        </label>
                    </div>
                </section>

                <div className="pt-4 border-t border-cream flex justify-end">
                    <Button onClick={handleOpslaan} data-testid="instellingen-opslaan" className="flex items-center gap-2">
                        <Save className="w-4 h-4" /> Instellingen Opslaan
                    </Button>
                </div>
            </div>
        </div>
    )
}
