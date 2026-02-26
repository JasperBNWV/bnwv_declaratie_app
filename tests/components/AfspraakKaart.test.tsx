import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AfspraakKaart } from '../../src/components/AfspraakKaart'
import { Afspraak } from '../../src/types'

const mockAfspraak: Afspraak = {
    id: 'afspraak-1',
    subject: 'Klantgesprek',
    start: { dateTime: '2023-02-03T09:00:00Z', timeZone: 'UTC' }, // vr 3 feb
    end: { dateTime: '2023-02-03T10:00:00Z', timeZone: 'UTC' }
}

describe('AfspraakKaart', () => {
    it('rendert de titel van de afspraak', () => {
        render(
            <AfspraakKaart
                afspraak={mockAfspraak}
                geselecteerd={false}
                inWachtrij={false}
                onToggle={vi.fn()}
                index={0}
            />
        )
        expect(screen.getByText('Klantgesprek')).toBeInTheDocument()
    })

    it('toont datum in leesbaar Nederlands formaat (bijv. "ma 3 feb")', () => {
        render(
            <AfspraakKaart
                afspraak={mockAfspraak}
                geselecteerd={false}
                inWachtrij={false}
                onToggle={vi.fn()}
                index={0}
            />
        )
        expect(screen.getByText(/vr 3 feb/i)).toBeInTheDocument()
    })

    it('roept onToggle aan met het juiste id bij klikken', () => {
        const handleToggle = vi.fn()
        render(
            <AfspraakKaart
                afspraak={mockAfspraak}
                geselecteerd={false}
                inWachtrij={false}
                onToggle={handleToggle}
                index={0}
            />
        )

        fireEvent.click(screen.getByTestId('afspraak-kaart-0'))
        expect(handleToggle).toHaveBeenCalledWith('afspraak-1')
    })

    it('toont "In wachtrij" badge wanneer inWachtrij=true', () => {
        render(
            <AfspraakKaart
                afspraak={mockAfspraak}
                geselecteerd={false}
                inWachtrij={true}
                onToggle={vi.fn()}
                index={0}
            />
        )
        expect(screen.getByText('In wachtrij')).toBeInTheDocument()
    })

    it('reageert niet op klik wanneer al in wachtrij', () => {
        const handleToggle = vi.fn()
        render(
            <AfspraakKaart
                afspraak={mockAfspraak}
                geselecteerd={false}
                inWachtrij={true}
                onToggle={handleToggle}
                index={0}
            />
        )

        // De div krijgt cursor-not-allowed, and the onClick has a guard !inWachtrij
        fireEvent.click(screen.getByTestId('afspraak-kaart-0'))
        expect(handleToggle).not.toHaveBeenCalled()
    })
})
