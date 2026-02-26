import { MapPin, Clock } from "lucide-react"
import { Afspraak } from "../../types"

interface AfspraakKaartProps {
  afspraak: Afspraak
  geselecteerd: boolean
  inWachtrij: boolean
  onToggle: (id: string) => void
  index: number
}

export function AfspraakKaart({ afspraak, geselecteerd, inWachtrij, onToggle, index }: AfspraakKaartProps) {
  const startDate = new Date(afspraak.start.dateTime)

  const formattedDate = startDate.toLocaleDateString("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "short"
  })

  const formattedTime = startDate.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit"
  })

  return (
    <div
      className={`relative p-4 rounded-lg border transition-all ${inWachtrij
        ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
        : geselecteerd
          ? "bg-accent/5 border-accent cursor-pointer ring-1 ring-accent"
          : "bg-white border-cream hover:border-accent/50 cursor-pointer"
        }`}
      onClick={() => {
        if (!inWachtrij) onToggle(afspraak.id)
      }}
      data-testid={`afspraak-kaart-${index}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-4">
          <h3 className="font-semibold text-ink line-clamp-1" title={afspraak.subject}>
            {afspraak.subject || "(Geen titel)"}
          </h3>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formattedDate} • {formattedTime}</span>
            </div>
            {afspraak.location?.displayName && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1" title={afspraak.location.displayName}>
                  {afspraak.location.displayName}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center">
          {inWachtrij ? (
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-medium">
              In wachtrij
            </span>
          ) : (
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${geselecteerd ? "bg-accent border-accent text-white" : "border-gray-300"
              }`}>
              {geselecteerd && (
                <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </div >
  )
}
