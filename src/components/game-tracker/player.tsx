'use client'

import ManaPoolUI from './mana-pool'
import TokenControl from './token-control'
import { ManaPool, Player } from './types'

const PlayerUI = ({
	player,
	playerIndex,
	isFlipped,
	updateHealth,
	updateMana,
	clearManaPool,
	updateTokenCount,
	addToken,
	newToken,
	handleTokenInput,
}: {
	player: Player
	playerIndex: number
	isFlipped: boolean
	updateHealth: (playerIndex: number, change: number) => void
	updateMana: (
		playerIndex: number,
		color: keyof ManaPool,
		change: number
	) => void
	clearManaPool: (playerIndex: number) => void
	updateTokenCount: (
		playerIndex: number,
		tokenIndex: number,
		change: number
	) => void
	addToken: (playerIndex: number) => void
	newToken: string
	handleTokenInput: (playerIndex: number, value: string) => void
}) => (
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
			<TokenControl
				playerIndex={playerIndex}
				tokens={player.tokens}
				updateTokenCount={updateTokenCount}
				addToken={addToken}
				newToken={newToken}
				handleTokenInput={handleTokenInput}
			/>
			<ManaPoolUI
				playerIndex={playerIndex}
				manaPool={player.manaPool}
				updateMana={updateMana}
				clearManaPool={clearManaPool}
			/>
		</div>
	</div>
)

export default PlayerUI
