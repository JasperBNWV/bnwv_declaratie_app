import { Afspraak } from '../../../src/types'

export const mockCalendarEventsResponse = {
    value: [
        {
            id: "AAMkADExAA123",
            subject: "E2E Klantgesprek Alpha",
            start: {
                dateTime: "2023-11-06T09:00:00.0000000",
                timeZone: "UTC"
            },
            end: {
                dateTime: "2023-11-06T10:00:00.0000000",
                timeZone: "UTC"
            }
        },
        {
            id: "AAMkADExAA456",
            subject: "Team Overleg",
            start: {
                dateTime: "2023-11-06T13:00:00.0000000",
                timeZone: "UTC"
            },
            end: {
                dateTime: "2023-11-06T14:30:00.0000000",
                timeZone: "UTC"
            }
        }
    ]
}
