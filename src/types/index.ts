export interface Afspraak {
    id: string
    subject: string
    start: { dateTime: string; timeZone: string }
    end: { dateTime: string; timeZone: string }
    location?: { displayName: string }
    bodyPreview?: string
}

export interface DeclaratieItem {
    id: string                   // uuid, gegenereerd bij aanmaken
    afspraakId: string
    datum: string                // "YYYY-MM-DD"
    van: string                  // thuisadres uit instellingen
    naar: string                 // vestigingsadres uit instellingen
    naarVestigingId: string      // id van de geselecteerde vestiging
    omschrijving: string         // subject van de afspraak
    km: number | null
    retour: boolean
    soort: "1" | "2" | "3" | "4" | "5"
    status: "te-doen" | "bezig" | "gedaan" | "overgeslagen"
}

export interface Vestiging {
    id: string
    naam: string       // bijv. "Amsterdam"
    adres: string      // bijv. "Hoofdstraat 1, 1234AB Amsterdam"
}
