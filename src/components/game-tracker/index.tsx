'use client'

import PlayerUI from './player'
import Cards from './cards'
import Settings from './settings'
import { useGameState } from './player-state'

export default function MTGHelper(): JSX.Element {
	const { players } = useGameState()

	return (
		<div
			className={`grid ${players.length === 4 && 'grid-cols-2'} h-screen bg-background text-foreground`}
		>
			{players.map((player, index) => (
				<PlayerUI
					key={'player-' + player.name.toLowerCase().replace(' ', '-')}
					player={players[index]}
					playerIndex={index}
					isFlipped={players.length === 4 ? index < 2 : index % 2 === 0}
				/>
			))}
			<Settings />
			<Cards />
		</div>
	)
}
