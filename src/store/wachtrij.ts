import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { DeclaratieItem } from "../types"

interface WachtrijStore {
    items: DeclaratieItem[]
    voegToe: (items: DeclaratieItem[]) => void
    markeerGedaan: (id: string) => void
    markeerOvergeslagen: (id: string) => void
    bewerk: (id: string, wijzigingen: Partial<DeclaratieItem>) => void
    actieveDeclaratie: () => DeclaratieItem | undefined
    voortgang: () => { gedaan: number; totaal: number }
    reset: () => void
}

export const useWachtrijStore = create<WachtrijStore>()(
    persist(
        (set, get) => ({
            items: [],
            voegToe: (nieuweItems) => set((state) => ({
                // Voorkom duplicaten op basis van afspraakId
                items: [
                    ...state.items,
                    ...nieuweItems.filter(
                        (n) => !state.items.some((i) => i.afspraakId === n.afspraakId)
                    ).map((item, idx) => ({
                        ...item,
                        status: idx === 0 && state.items.length === 0 ? "bezig" : "te-doen"
                    } as DeclaratieItem))
                ]
            })),
            markeerGedaan: (id) => set((state) => {
                const items = state.items.map((item) =>
                    item.id === id ? { ...item, status: "gedaan" as const } : item
                )
                // Activeer het volgende te-doen item
                const volgende = items.find((i) => i.status === "te-doen")
                if (volgende) {
                    return { items: items.map((i) => i.id === volgende.id ? { ...i, status: "bezig" as const } : i) }
                }
                return { items }
            }),
            markeerOvergeslagen: (id) => set((state) => {
                const items = state.items.map((item) =>
                    item.id === id ? { ...item, status: "overgeslagen" as const } : item
                )
                const volgende = items.find((i) => i.status === "te-doen")
                if (volgende) {
                    return { items: items.map((i) => i.id === volgende.id ? { ...i, status: "bezig" as const } : i) }
                }
                return { items }
            }),
            bewerk: (id, wijzigingen) => set((state) => ({
                items: state.items.map((item) => item.id === id ? { ...item, ...wijzigingen } : item)
            })),
            actieveDeclaratie: () => get().items.find((i) => i.status === "bezig"),
            voortgang: () => ({
                gedaan: get().items.filter((i) => i.status === "gedaan").length,
                totaal: get().items.length,
            }),
            reset: () => set({ items: [] }),
        }),
        { name: "matt-wachtrij", storage: createJSONStorage(() => sessionStorage) }
    )
)
