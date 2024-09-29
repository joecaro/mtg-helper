'use client'

import PlayerCards from './cards-player'
import ManaPoolUI from './mana-pool'
import { useGameState } from './player-state'
import TokenControl from './token-control'
import { Player } from './types'

const PlayerUI = ({
	player,
	playerIndex,
	isFlipped,
}: {
	player: Player
	playerIndex: number
	isFlipped: boolean
}) => {
	const { updateHealth } = useGameState()
	return (
		<div className={`flex-1 p-4 ${isFlipped ? 'transform rotate-180' : ''}`}>
			<h2 className="text-2xl font-bold mb-4">{player.name}</h2>
			<div className="relative">
				<div className="text-6xl font-bold mb-6 text-center p-4 bg-primary text-primary-foreground rounded-lg cursor-pointer">
					{player.health}
				</div>
				<button
					className="absolute h-full w-1/2 top-0 left-0 active:bg-opacity-20 active:bg-slate-400"
					onClick={() => updateHealth(playerIndex, -1)}
				></button>
				<button
					className="absolute h-full w-1/2 top-0 right-0 active:bg-opacity-20 active:bg-neutral-400"
					onClick={() => updateHealth(playerIndex, 1)}
				></button>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<TokenControl playerIndex={playerIndex} />
				<PlayerCards playerIndex={playerIndex} />
				{/* <ManaPoolUI playerIndex={playerIndex} /> */}
			</div>
		</div>
	)
}

export default PlayerUI
