import { v4 as uuidv4 } from "uuid"
import { Afspraak, DeclaratieItem, Vestiging } from "../types"

export function afspraakNaarDeclaratie(
    afspraak: Afspraak,
    instellingen: {
        thuisadres: string
        standaardVestiging: Vestiging
        standaardSoort: DeclaratieItem["soort"]
        standaardRetour: boolean
    }
): DeclaratieItem {
    return {
        id: uuidv4(),
        afspraakId: afspraak.id,
        datum: afspraak.start.dateTime.substring(0, 10),  // "YYYY-MM-DD"
        van: instellingen.thuisadres,
        naar: instellingen.standaardVestiging.adres,
        naarVestigingId: instellingen.standaardVestiging.id,
        omschrijving: afspraak.subject,
        km: null,      // Gebruiker vult handmatig in
        retour: instellingen.standaardRetour,
        soort: instellingen.standaardSoort,
        status: "te-doen",
    }
}
