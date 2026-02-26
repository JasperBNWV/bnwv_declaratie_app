import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DeclaratieWachtrij } from '../../src/components/DeclaratieWachtrij'
import { useWachtrijStore } from '../../src/store/wachtrij'
import { DeclaratieItem } from '../../src/types'

// Mock de Wachtrij Store
vi.mock('../../src/store/wachtrij', () => ({
    useWachtrijStore: vi.fn()
}))

// Mock de Instellingen Store om vestigingen te leveren
vi.mock('../../src/store/instellingen', () => ({
    useInstellingenStore: () => ({
        vestigingen: [
            { id: 'v1', naam: 'Kantoor', adres: 'Hoofdstraat 1' }
        ]
    })
}))

const mockDeclaraties: DeclaratieItem[] = [
    {
        id: 'decl-1', afspraakId: 'af-1', datum: '2023-11-01',
        van: 'Thuisadres 1', naar: 'Hoofdstraat 1', naarVestigingId: 'v1',
        omschrijving: 'Reis naar kantoor', km: 24, retour: true,
        soort: '2', status: 'bezig'
    },
    {
        id: 'decl-2', afspraakId: 'af-2', datum: '2023-11-02',
        van: 'Thuisadres 1', naar: 'Klantadres 2', naarVestigingId: null,
        omschrijving: 'Klantbezoek', km: null, retour: false,
        soort: '3', status: 'wachtend'
    }
]

describe('DeclaratieWachtrij', () => {
    const checkMock = vi.fn()
    const skipMock = vi.fn()
    const bewerkMock = vi.fn()

    beforeEach(() => {
        vi.resetAllMocks()
            ; (useWachtrijStore as any).mockReturnValue({
                items: mockDeclaraties,
                markeerGedaan: checkMock,
                markeerOvergeslagen: skipMock,
                bewerk: bewerkMock
            })
    })

    it('toont een lege status als de wachtrij leeg is', () => {
        ; (useWachtrijStore as any).mockReturnValue({ items: [] })
        render(<DeclaratieWachtrij />)
        expect(screen.getByText(/je wachtrij is leeg/i)).toBeInTheDocument()
    })

    it('toont alle items in de wachtrij', () => {
        render(<DeclaratieWachtrij />)
        expect(screen.getByText('Reis naar kantoor')).toBeInTheDocument()
        expect(screen.getByText('Klantbezoek')).toBeInTheDocument()
    })

    it('identificeert het actieve ("bezig") item', () => {
        render(<DeclaratieWachtrij />)
        const actieveDiv = screen.getByTestId('actieve-declaratie')
        expect(actieveDiv).toBeInTheDocument()
        expect(actieveDiv).toHaveTextContent('Reis naar kantoor')
    })

    it('toont acties "Markeer als gedaan" en "Overslaan" bij het actieve item', () => {
        render(<DeclaratieWachtrij />)
        expect(screen.getByTestId('markeer-gedaan')).toBeInTheDocument()
        expect(screen.getByTestId('overslaan')).toBeInTheDocument()
    })

    it('roept markeerGedaan over de wachtrij store als de knop geklikt is', () => {
        render(<DeclaratieWachtrij />)
        fireEvent.click(screen.getByTestId('markeer-gedaan'))
        expect(checkMock).toHaveBeenCalledWith('decl-1')
    })

    it('roept markeerOvergeslagen over de wachtrij store als overslaan geklikt is', () => {
        render(<DeclaratieWachtrij />)
        fireEvent.click(screen.getByTestId('overslaan'))
        expect(skipMock).toHaveBeenCalledWith('decl-1')
    })

    it('bewerk()-functie wordt aangeroepen bij aanpassen velden in actief item', () => {
        render(<DeclaratieWachtrij />)

        // We expect the distance input to trigger bewerk() with { km: 30 }
        const afstandInputs = screen.getAllByLabelText(/afstand/i)
        fireEvent.change(afstandInputs[0], { target: { value: '30' } })

        expect(bewerkMock).toHaveBeenCalledWith('decl-1', { km: 30 })
    })
})
