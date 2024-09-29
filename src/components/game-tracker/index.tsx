'use client'

import { useState } from 'react'
import { Card, ManaPool, Player, Token } from './types'
import PlayerUI from './player'
import Cards from './cards'
import Settings from './settings'

const initialManaPool: ManaPool = {
	white: 0,
	blue: 0,
	black: 0,
	red: 0,
	green: 0,
	colorless: 0,
}

export default function MTGHelper(): JSX.Element {
	const [players, setPlayers] = useState<Player[]>([
		{
			name: 'Player 1',
			health: 40,
			tokens: [],
			manaPool: { ...initialManaPool },
			cards: [],
		},
		{
			name: 'Player 2',
			health: 40,
			tokens: [],
			manaPool: { ...initialManaPool },
			cards: [],
		},
	])
	const [newTokens, setNewTokens] = useState(['', ''])

	// Set number of players
	const setNumPlayers = (num: 2 | 4) => {
		if (num === 2) {
			setPlayers(
				Array.from({ length: 2 }, (_, i) => ({
					name: `Player ${i + 1}`,
					health: 40,
					tokens: [],
					manaPool: { ...initialManaPool },
					cards: [],
				}))
			)
			setNewTokens(['', ''])
		} else {
			setPlayers(
				Array.from({ length: 4 }, (_, i) => ({
					name: `Player ${i + 1}`,
					health: 40,
					tokens: [],
					manaPool: { ...initialManaPool },
					cards: [],
				}))
			)
			setNewTokens(['', '', '', ''])
		}
	}

	// Health update function
	const updateHealth = (playerIndex: number, change: number) => {
		setPlayers((prevPlayers) =>
			prevPlayers.map((player, index) =>
				index === playerIndex
					? { ...player, health: Math.max(0, player.health + change) }
					: player
			)
		)
	}

	// Mana update function
	const updateMana = (
		playerIndex: number,
		color: keyof ManaPool,
		change: number
	) => {
		setPlayers((prevPlayers) =>
			prevPlayers.map((player, index) =>
				index === playerIndex
					? {
							...player,
							manaPool: {
								...player.manaPool,
								[color]: Math.max(0, player.manaPool[color] + change),
							},
						}
					: player
			)
		)
	}

	const clearManaPool = (playerIndex: number) => {
		setPlayers((prevPlayers) =>
			prevPlayers.map((player, index) =>
				index === playerIndex
					? { ...player, manaPool: { ...initialManaPool } }
					: player
			)
		)
	}

	// Token functions
	const updateTokenCount = (
		playerIndex: number,
		tokenIndex: number,
		change: number
	) => {
		setPlayers((prevPlayers) =>
			prevPlayers.map((player, pIndex) =>
				pIndex === playerIndex
					? {
							...player,
							tokens: player.tokens.map((token: Token, tIndex: number) =>
								tIndex === tokenIndex
									? { ...token, count: Math.max(0, token.count + change) }
									: token
							),
						}
					: player
			)
		)
	}

	const addToken = (playerIndex: number) => {
		if (newTokens[playerIndex].trim()) {
			setPlayers((prevPlayers) =>
				prevPlayers.map((player, index) =>
					index === playerIndex
						? {
								...player,
								tokens: [
									...player.tokens,
									{ name: newTokens[playerIndex].trim(), count: 1 },
								],
							}
						: player
				)
			)
			setNewTokens((prev) =>
				prev.map((token, index) => (index === playerIndex ? '' : token))
			)
		}
	}

	const handleTokenInput = (playerIndex: number, value: string) => {
		setNewTokens((prev) =>
			prev.map((token, index) => (index === playerIndex ? value : token))
		)
	}

	const updateCard = (card: Card, cardIndex: number, playerIndex: number) => {
		setPlayers((prevPlayers) =>
			prevPlayers.map((player, index) =>
				index === playerIndex
					? {
							...player,
							cards:
								cardIndex > player.cards.length - 1 // If the card index is greater than the number of cards, add a new card
									? [...player.cards, card]
									: player.cards.map((c: Card, cIndex: number) =>
											cIndex === cardIndex ? card : c
										),
						}
					: player
			)
		)
	}

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
					updateHealth={updateHealth}
					updateMana={updateMana}
					clearManaPool={clearManaPool}
					updateTokenCount={updateTokenCount}
					addToken={addToken}
					newToken={newTokens[index]} // Pass the correct token for each player
					handleTokenInput={handleTokenInput}
				/>
			))}
			<Settings setPlayers={setNumPlayers} />
			<Cards players={players} updateCard={updateCard} />
		</div>
	)
}
