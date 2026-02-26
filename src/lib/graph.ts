import { Client } from "@microsoft/microsoft-graph-client"
import type { Afspraak } from "../types"

export function getGraphClient(accessToken: string): Client {
    return Client.init({
        authProvider: (done) => done(null, accessToken),
    })
}

export async function getCalendarEvents(
    accessToken: string,
    from: string,
    to: string
): Promise<Afspraak[]> {
    const client = getGraphClient(accessToken)
    const response = await client
        .api("/me/calendarView")
        .query({ startDateTime: from, endDateTime: to })
        .select("id,subject,start,end,location,bodyPreview")
        .orderby("start/dateTime")
        .get()
    return response.value
}
