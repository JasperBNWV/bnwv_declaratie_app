import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { InstellingenPage } from '../../src/pages/InstellingenPage'
import { useInstellingenStore } from '../../src/store/instellingen'

// Mock react-router-dom useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

// Mock Zustand store
vi.mock('../../src/store/instellingen', () => ({
    useInstellingenStore: vi.fn()
}))

describe('InstellingenPage', () => {
    const mockSlaOp = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
            ; (useInstellingenStore as any).mockReturnValue({
                thuisadres: '',
                vestigingen: [],
                standaardSoort: '2',
                standaardRetour: false,
                standaardVestigingId: null,
                slaOp: mockSlaOp
            })
    })

    it('toont een errormelding als het thuisadres leeg is en je klikt op opslaan', () => {
        render(
            <MemoryRouter>
                <InstellingenPage />
            </MemoryRouter>
        )

        fireEvent.click(screen.getByTestId('instellingen-opslaan'))
        expect(screen.getByText(/Thuisadres is verplicht/i)).toBeInTheDocument()
        expect(mockSlaOp).not.toHaveBeenCalled()
    })

    it('voegt een lege vestiging toe aan UI wanneer de pagina leeg laadt', () => {
        render(
            <MemoryRouter>
                <InstellingenPage />
            </MemoryRouter>
        )

        // Bij initiële render met lege lijst, voegt setVestigingen direct eentje toe.
        const naamInputs = screen.getAllByLabelText(/Naam vestiging/i)
        expect(naamInputs).toHaveLength(1)
    })

    it('kan meerdere vestigingen via Toevoegen toevoegen in de UI', () => {
        render(
            <MemoryRouter>
                <InstellingenPage />
            </MemoryRouter>
        )

        const voegToeBtn = screen.getByTestId('vestiging-toevoegen')
        fireEvent.click(voegToeBtn)

        expect(screen.getAllByLabelText(/Naam vestiging/i)).toHaveLength(2)
    })

    it('Slaat succesvol op als vereiste velden zijn ingevuld', () => {
        render(
            <MemoryRouter>
                <InstellingenPage />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByTestId('thuisadres'), { target: { value: 'Mijnstraat 1' } })
        fireEvent.change(screen.getByTestId('vestiging-naam-0'), { target: { value: 'Kantoor' } })
        fireEvent.change(screen.getByTestId('vestiging-adres-0'), { target: { value: 'Adres 1' } })

        fireEvent.click(screen.getByTestId('instellingen-opslaan'))

        expect(mockSlaOp).toHaveBeenCalledWith(expect.objectContaining({
            thuisadres: 'Mijnstraat 1',
            vestigingen: expect.arrayContaining([expect.objectContaining({ naam: 'Kantoor', adres: 'Adres 1' })])
        }))
        expect(mockNavigate).toHaveBeenCalledWith('/agenda')
    })
})
