import { describe, it, expect } from 'vitest'
import { generateBookmarklet } from '../../src/lib/bookmarklet'
import { DeclaratieItem } from '../../src/types'

describe('generateBookmarklet', () => {
    const dummyDeclaratie: DeclaratieItem = {
        id: 'decl-1',
        afspraakId: 'afspraak-1',
        datum: '2023-05-18', // YYYY-MM-DD format
        van: 'Kerkstraat 1',
        naar: 'Amsterdam',
        naarVestigingId: '1',
        omschrijving: 'Overleg over een project (Test!)',
        km: 45,
        retour: true,
        soort: '2',
        status: 'bezig'
    }

    it('genereert een geldige javascript: URL', () => {
        const result = generateBookmarklet(dummyDeclaratie)
        expect(result).toMatch(/^javascript:/)
        expect(result).not.toContain('\n')
    })

    it('bevat soort, omschrijving, km en retour in het script', () => {
        const result = generateBookmarklet(dummyDeclaratie)
        const script = decodeURIComponent(result.replace('javascript:', ''))

        expect(script).toContain('"soort":"2"')
        expect(script).toContain('"omschrijving":"Overleg over een project (Test!)"')
        expect(script).toContain('"km":45')
        expect(script).toContain('"retour":true')
    })

    it('formatteert datum als DD-MM-YYYY voor de datepicker', () => {
        const result = generateBookmarklet(dummyDeclaratie)
        const script = decodeURIComponent(result.replace('javascript:', ''))

        expect(script).toContain('"doelDatum":"18-05-2023"')
        expect(script).toContain('"doelMaand":5')
        expect(script).toContain('"doelJaar":2023')
    })

    it('encodeert speciale tekens correct zodat de URL geldig blijft', () => {
        const result = generateBookmarklet({
            ...dummyDeclaratie,
            omschrijving: "A & B? Dat is 100% goed!"
        })

        // Check if space is encoded or check if the original text exists after decode
        const decoded = decodeURIComponent(result.replace('javascript:', ''))
        expect(decoded).toContain('"omschrijving":"A & B? Dat is 100% goed!"')
        expect(result).not.toContain(' ') // Should be %20
    })

    it('bevat maandnavigatie-logica voor datums buiten de huidige maand', () => {
        const result = generateBookmarklet(dummyDeclaratie)
        const script = decodeURIComponent(result.replace('javascript:', ''))

        expect(script).toContain('select.datepick-month-year')
        expect(script).toContain('Huidige maand klopt niet')
        expect(script).toContain('selecteerDag()') // Functie voor selectie zit er in
    })
})
