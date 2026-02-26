import { useState } from "react"
import { useMsal } from "@azure/msal-react"
import { loginRequest } from "../lib/msalConfig"
import { getCalendarEvents } from "../lib/graph"
import type { Afspraak } from "../types"

export function useAfspraken() {
    const { instance, accounts } = useMsal()
    const [fout, setFout] = useState<string | null>(null)
    const [laden, setLaden] = useState(false)

    async function fetchAfspraken(from: string, to: string): Promise<Afspraak[]> {
        setLaden(true)
        setFout(null)

        // Safety check in case we somehow render while not logged in
        if (!accounts || accounts.length === 0) {
            setFout("Je bent niet ingelogd.")
            setLaden(false)
            return []
        }

        try {
            // 1. Probeer token in de achtergrond aan te vragen
            const response = await instance
                .acquireTokenSilent({ ...loginRequest, account: accounts[0] })
                .catch(() => instance.acquireTokenPopup(loginRequest)) // 2. Fallback naar popup

            // 3. Haal afspraken op
            const events = await getCalendarEvents(response.accessToken, from, to)
            return events
        } catch (e: unknown) {
            console.error("Fout bij ophalen van de afspraken", e)
            setFout("Kon afspraken niet laden. Controleer je verbinding en probeer opnieuw.")
            return []
        } finally {
            setLaden(false)
        }
    }

    return { fetchAfspraken, fout, laden }
}
