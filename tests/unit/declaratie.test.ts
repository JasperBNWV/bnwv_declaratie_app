import { describe, it, expect } from 'vitest'
import { afspraakNaarDeclaratie } from '../../src/lib/declaratie'
import type { Afspraak, DeclaratieItem, Vestiging } from '../../src/types'

describe('afspraakNaarDeclaratie', () => {
    const mockAfspraak: Afspraak = {
        id: 'afspraak-1',
        subject: 'Klantgesprek',
        start: { dateTime: '2023-11-05T09:00:00Z', timeZone: 'UTC' },
        end: { dateTime: '2023-11-05T10:00:00Z', timeZone: 'UTC' }
    }

    const mockInstellingen: {
        thuisadres: string;
        standaardVestiging: Vestiging;
        standaardSoort: DeclaratieItem['soort'];
        standaardRetour: boolean;
    } = {
        thuisadres: 'Kerkstraat 1, Den Haag',
        standaardVestiging: { id: 'vest-1', naam: 'Kantoor', adres: 'Hoofdstraat 1, Amsterdam' },
        standaardSoort: '1',
        standaardRetour: true
    }

    it('vult datum correct in als YYYY-MM-DD', () => {
        const result = afspraakNaarDeclaratie(mockAfspraak, mockInstellingen)
        expect(result.datum).toBe('2023-11-05')
    })

    it('gebruikt thuisadres als Van', () => {
        const result = afspraakNaarDeclaratie(mockAfspraak, mockInstellingen)
        expect(result.van).toBe('Kerkstraat 1, Den Haag')
    })

    it('gebruikt standaard vestigingsadres als Naar', () => {
        const result = afspraakNaarDeclaratie(mockAfspraak, mockInstellingen)
        expect(result.naar).toBe('Hoofdstraat 1, Amsterdam')
    })

    it('gebruikt standaard soort en retour uit instellingen', () => {
        const result = afspraakNaarDeclaratie(mockAfspraak, mockInstellingen)
        expect(result.soort).toBe('1')
        expect(result.retour).toBe(true)
    })

    it('gebruikt afspraak subject als omschrijving', () => {
        const result = afspraakNaarDeclaratie(mockAfspraak, mockInstellingen)
        expect(result.omschrijving).toBe('Klantgesprek')
    })

    it('genereert een uniek id per aanroep', () => {
        const result1 = afspraakNaarDeclaratie(mockAfspraak, mockInstellingen)
        const result2 = afspraakNaarDeclaratie(mockAfspraak, mockInstellingen)
        expect(result1.id).toBeDefined()
        expect(result2.id).toBeDefined()
        expect(result1.id).not.toBe(result2.id)
    })
})
