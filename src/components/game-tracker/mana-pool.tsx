'use client'

import { Button } from '@/components/ui/button'
import { ManaPool } from './types'
import { Minus, Plus } from 'lucide-react'

const ManaPoolUI = ({
	playerIndex,
	manaPool,
	updateMana,
	clearManaPool,
}: {
	playerIndex: number
	manaPool: ManaPool
	updateMana: (
		playerIndex: number,
		color: keyof ManaPool,
		change: number
	) => void
	clearManaPool: (playerIndex: number) => void
}) => {
	const manaColors: (keyof ManaPool)[] = [
		'white',
		'blue',
		'black',
		'red',
		'green',
		'colorless',
	]
	const manaSymbols: Record<keyof ManaPool, { display: string; bg: string }> = {
		white: { display: 'W', bg: 'bg-white' },
		blue: { display: 'U', bg: 'bg-blue-200' },
		black: { display: 'B', bg: 'bg-neutral-500' },
		red: { display: 'R', bg: 'bg-red-200' },
		green: { display: 'G', bg: 'bg-green-200' },
		colorless: { display: 'C', bg: 'bg-gray-200' },
	}

	return (
		<div className="mt-4 p-2 bg-muted rounded-lg">
			<h3 className="text-lg font-semibold mb-2">Mana Pool</h3>
			<div className="grid grid-cols-2 justify-items-center gap-2 items-center">
				{manaColors.map((color) => (
					<div
						key={color}
						className={`flex items-center justify-around max-w-40 border rounded-md ${manaSymbols[color].bg}`}
					>
						<Button
							className={`${manaSymbols[color].bg} border-none`}
							variant="outline"
							onClick={() => updateMana(playerIndex, color, -1)}
						>
							<Minus className="h-4 w-4" />
						</Button>
						<span className="text-sm font-medium text-center flex items-center justify-center">
							<span className="font-bold text-2xl">{manaPool[color]}</span>
						</span>
						<Button
							className={`${manaSymbols[color].bg} border-none`}
							variant="outline"
							onClick={() => updateMana(playerIndex, color, 1)}
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				))}
			</div>
			<Button
				variant="outline"
				size="sm"
				className="mt-2 w-full"
				onClick={() => clearManaPool(playerIndex)}
			>
				Clear Mana Pool
			</Button>
		</div>
	)
}

export default ManaPoolUI
