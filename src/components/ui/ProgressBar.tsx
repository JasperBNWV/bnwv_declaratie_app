interface ProgressBarProps {
    gedaan: number
    totaal: number
}

export function ProgressBar({ gedaan, totaal }: ProgressBarProps) {
    const percentage = totaal === 0 ? 0 : Math.round((gedaan / totaal) * 100)

    return (
        <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-muted">Voortgang</span>
                <span className="font-semibold" data-testid="voortgang">
                    {gedaan} van {totaal} ingediend ({percentage}%)
                </span>
            </div>
            <div className="h-2 w-full bg-cream rounded-full overflow-hidden">
                <div
                    className="h-full bg-success transition-all duration-500 ease-in-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}
