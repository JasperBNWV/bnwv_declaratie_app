import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { DeclaratieItem, Vestiging } from "../types"

interface InstellingenStore {
    thuisadres: string
    vestigingen: Vestiging[]
    standaardSoort: DeclaratieItem["soort"]
    standaardRetour: boolean
    standaardVestigingId: string | null
    slaOp: (instellingen: Partial<InstellingenStore>) => void
}

export const useInstellingenStore = create<InstellingenStore>()(
    persist(
        (set) => ({
            thuisadres: "",
            vestigingen: [],           // Gebruiker voert max 5 vestigingen in
            standaardSoort: "1",       // Woon-werkverkeer
            standaardRetour: true,
            standaardVestigingId: null,
            slaOp: (instellingen) => set((state) => ({ ...state, ...instellingen })),
        }),
        { name: "matt-instellingen", storage: createJSONStorage(() => localStorage) }
    )
)
