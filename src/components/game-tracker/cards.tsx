'use client'

import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { useGameState } from './player-state'
import PlayerCards from './cards-player'

const Cards = () => {
	const { players, updateCard } = useGameState()
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)

	return (
		<Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
			<DialogTrigger asChild>
				<Button className="absolute bottom-4 left-4 p-2 hidden sm:block">
					Cards
				</Button>
			</DialogTrigger>
			<DialogContent className={`${players.length === 2 && 'w-3/4'} max-w-full`}>
				<DialogHeader>
					<DialogTitle>Player Cards</DialogTitle>
					<div className={`grid ${players.length === 4 && 'grid-cols-2'}`}>
						{players.map((player, playerIndex) => (
							<div
								key={player.name + playerIndex}
								className={`${(players.length === 4 ? playerIndex < 2 : playerIndex % 2 === 0) ? 'transform rotate-180' : ''}`}
							>
								<PlayerCards
									key={player.name + playerIndex}
									playerIndex={playerIndex}
								/>
							</div>
						))}
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

export default Cards
