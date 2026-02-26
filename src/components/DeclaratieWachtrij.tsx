import { useState } from "react"
import { useWachtrijStore } from "../store/wachtrij"
import { useInstellingenStore } from "../store/instellingen"
import { Badge } from "./ui/Badge"
import { Button } from "./ui/Button"
import { Select } from "./ui/Select"
import { Input } from "./ui/Input"
import { ClipboardButton } from "./ui/ClipboardButton"
import { generateBookmarklet } from "../lib/bookmarklet"
import { BookmarkletInstructie } from "./BookmarkletInstructie"
import { ChevronDown, ChevronRight, Check, X, Pencil } from "lucide-react"
import type { DeclaratieItem } from "../types"

export function DeclaratieWachtrij() {
  const { items, markeerGedaan, markeerOvergeslagen, bewerk } = useWachtrijStore()
  const { vestigingen } = useInstellingenStore()

  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  if (items.length === 0) {
    return (
      <div className="text-center p-12 bg-cream/30 rounded-lg border border-cream border-dashed mt-6">
        <h3 className="text-xl font-serif text-ink mb-2">Je wachtrij is leeg</h3>
        <p className="text-muted">Ga naar Agenda om afspraken toe te voegen.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 mt-6">
      {items.map((item, index) => {
        const isActief = item.status === "bezig"
        const isGedaan = item.status === "gedaan" || item.status === "overgeslagen"
        const isExpanded = isActief || expandedId === item.id
        const bookmarkletUrl = generateBookmarklet(item)

        return (
          <div
            key={item.id}
            className={`border rounded-lg overflow-hidden transition-all bg-white ${isActief
              ? "border-accent ring-1 ring-accent shadow-md"
              : isGedaan
                ? "border-cream/50 opacity-60 bg-gray-50"
                : "border-cream hover:border-gray-300"
              }`}
            data-testid={isActief ? "actieve-declaratie" : `wachtrij-item-${index}`}
          >
            {/* Header (altijd zichtbaar) */}
            <div
              className={`flex items-center gap-4 p-4 ${!isActief ? "cursor-pointer" : ""
                }`}
              onClick={() => {
                if (!isActief) toggleExpand(item.id)
              }}
            >
              <div className="flex-none text-muted font-mono w-6 text-right">
                {index + 1}.
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold truncate" title={item.omschrijving}>
                    {item.omschrijving || "Geen omschrijving"}
                  </h3>
                  <Badge status={item.status} className="" />
                </div>
                <div className="text-sm text-muted">
                  {item.datum} • {item.van} <ChevronRight className="inline w-3 h-3" /> {item.naar}
                  {item.km !== null ? ` • ${item.km} km` : ""}
                  {item.retour ? " • Retour" : ""}
                </div>
              </div>

              <div className="flex-none flex items-center gap-2">
                {!isActief && (
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}>
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-muted" /> : <ChevronRight className="w-5 h-5 text-muted" />}
                  </Button>
                )}
              </div>
            </div>

            {/* Inhoud (alleen actief of handmatig uitgevouwen) */}
            {isExpanded && (
              <div className={`p-4 pt-0 border-t border-cream ${isActief ? 'bg-accent/5' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* Linker kolom: Formulier details */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-ink mb-3 flex items-center gap-2">
                      <Pencil className="w-4 h-4 text-muted" /> Detailgegevens
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Datum"
                        type="date"
                        value={item.datum}
                        onChange={(e) => bewerk(item.id, { datum: e.target.value })}
                        disabled={isGedaan}
                      />
                      <Select
                        label="Soort Declaratie"
                        value={item.soort}
                        onChange={(e) => bewerk(item.id, { soort: e.target.value as DeclaratieItem["soort"] })}
                        disabled={isGedaan}
                      >
                        <option value="1">Woon/werk reiskosten - met een ander vervoersmiddel</option>
                        <option value="2">Zakelijke reiskosten - via app gereserveerd / met persoonlijk ov chipkaart</option>
                        <option value="3">Zakelijke reiskosten - overig auto</option>
                        <option value="4">Zakelijke reiskosten - overig fiets 0.23 / openbaar vervoer</option>
                        <option value="5">Zakelijke reiskosten - overig openbaar vervoer</option>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-end gap-2">
                        <Input
                          label="Van"
                          value={item.van}
                          onChange={(e) => bewerk(item.id, { van: e.target.value })}
                          disabled={isGedaan}
                        />
                        <ClipboardButton text={item.van} className="mb-px" />
                      </div>

                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <Select
                            label="Naar"
                            value={item.naar}
                            onChange={(e) => {
                              const adres = vestigingen.find((v) => v.adres === e.target.value)?.adres || e.target.value
                              bewerk(item.id, { naar: adres, naarVestigingId: e.target.value }) // Eenvoudige mapping
                            }}
                            disabled={isGedaan}
                          >
                            {/* Laat de textInput versie behouden voor "Naar" als het vrij bewerkbaar is. 
                                In de spec staat: select van vestigingen */}
                            {vestigingen.map((v) => (
                              <option key={v.id} value={v.adres}>{v.naam} ({v.adres})</option>
                            ))}
                            {/* Fallback optie voor custom input / direct address als het niet in vestigingen zit */}
                            {!vestigingen.some(v => v.adres === item.naar) && (
                              <option value={item.naar}>{item.naar} (aangepast)</option>
                            )}
                          </Select>
                        </div>
                        <ClipboardButton text={item.naar} className="mb-px" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Afstand (km)"
                        type="number"
                        min="0"
                        placeholder="bijv. 45"
                        value={item.km === null ? "" : item.km}
                        onChange={(e) => bewerk(item.id, { km: e.target.value ? Number(e.target.value) : null })}
                        disabled={isGedaan}
                      />
                      <div className="flex flex-col gap-1 justify-center pt-5">
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                          <input
                            type="checkbox"
                            checked={item.retour}
                            onChange={(e) => bewerk(item.id, { retour: e.target.checked })}
                            disabled={isGedaan}
                            className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                          />
                          Retour (heen en terug)
                        </label>
                      </div>
                    </div>

                    <Input
                      label="Omschrijving (Onderwerp / Doel)"
                      value={item.omschrijving}
                      onChange={(e) => bewerk(item.id, { omschrijving: e.target.value })}
                      disabled={isGedaan}
                    />
                  </div>

                  {/* Rechter kolom: Instructies & Acties (voornamelijk voor actieve item) */}
                  <div className="flex flex-col h-full">
                    {isActief && (
                      <div className="mb-6 flex-1">
                        <BookmarkletInstructie url={bookmarkletUrl} />
                      </div>
                    )}

                    <div className={`flex flex-wrap gap-3 ${!isActief ? 'mt-auto pt-4' : ''}`}>
                      {!isGedaan ? (
                        <>
                          <Button
                            variant="primary"
                            onClick={(e) => { e.stopPropagation(); markeerGedaan(item.id); }}
                            className="flex-1 flex gap-2"
                            data-testid="markeer-gedaan"
                          >
                            <Check className="w-4 h-4" /> Markeer als gedaan
                          </Button>
                          <Button
                            variant="outline"
                            onClick={(e) => { e.stopPropagation(); markeerOvergeslagen(item.id); }}
                            className="flex gap-2"
                            data-testid="overslaan"
                          >
                            <X className="w-4 h-4" /> Overslaan
                          </Button>
                        </>
                      ) : (
                        <div className="text-sm text-muted bg-gray-100 p-3 rounded-md w-full flex items-center gap-2">
                          <Check className="w-4 h-4 text-success" />
                          De status van dit item is opgeslagen als '{item.status}'.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
