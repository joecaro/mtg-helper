'use client'

import { createContext, useContext, useReducer } from 'react'

interface Token {
	name: string
	count: number
}

interface ManaPool {
	white: number
	blue: number
	black: number
	red: number
	green: number
	colorless: number
}

interface Card {
	name: string
	power: number
	defense: number
	statuses: string[]
}

interface Player {
	name: string
	health: number
	tokens: Token[]
	manaPool: ManaPool
	cards: Card[]
}

const initialManaPool: ManaPool = {
	white: 0,
	blue: 0,
	black: 0,
	red: 0,
	green: 0,
	colorless: 0,
}

type PlayerAction =
	| { type: 'SET_PLAYERS'; payload: Player[] }
	| { type: 'UPDATE_HEALTH'; playerIndex: number; change: number }
	| {
			type: 'UPDATE_MANA'
			playerIndex: number
			color: keyof ManaPool
			change: number
	  }
	| { type: 'CLEAR_MANA_POOL'; playerIndex: number }
	| {
			type: 'UPDATE_TOKEN_COUNT'
			playerIndex: number
			tokenIndex: number
			change: number
	  }
	| { type: 'ADD_TOKEN'; playerIndex: number; tokenName: string }
	| { type: 'UPDATE_CARD'; card: Card; cardIndex: number; playerIndex: number }
	| { type: 'ADD_CARD'; playerIndex: number; card: Card }

const playerReducer = (state: Player[], action: PlayerAction): Player[] => {
	switch (action.type) {
		case 'SET_PLAYERS':
			return action.payload

		case 'UPDATE_HEALTH':
			return state.map((player, index) =>
				index === action.playerIndex
					? { ...player, health: Math.max(0, player.health + action.change) }
					: player
			)

		case 'UPDATE_MANA':
			return state.map((player, index) =>
				index === action.playerIndex
					? {
							...player,
							manaPool: {
								...player.manaPool,
								[action.color]: Math.max(
									0,
									player.manaPool[action.color] + action.change
								),
							},
						}
					: player
			)

		case 'CLEAR_MANA_POOL':
			return state.map((player, index) =>
				index === action.playerIndex
					? { ...player, manaPool: { ...initialManaPool } }
					: player
			)

		case 'UPDATE_TOKEN_COUNT':
			return state.map((player, index) =>
				index === action.playerIndex
					? {
							...player,
							tokens: player.tokens.map((token, tokenIndex) =>
								tokenIndex === action.tokenIndex
									? {
											...token,
											count: Math.max(0, token.count + action.change),
										}
									: token
							),
						}
					: player
			)

		case 'ADD_TOKEN':
			return state.map((player, index) =>
				index === action.playerIndex
					? {
							...player,
							tokens: [
								...player.tokens,
								{ name: action.tokenName.trim(), count: 1 },
							],
						}
					: player
			)

		case 'UPDATE_CARD':
			return state.map((player, index) =>
				index === action.playerIndex
					? {
							...player,
							cards:
								action.cardIndex > player.cards.length - 1
									? [...player.cards, action.card]
									: player.cards.map((c, cIndex) =>
											cIndex === action.cardIndex ? action.card : c
										),
						}
					: player
			)

		case 'ADD_CARD':
			return state.map((player, index) =>
				index === action.playerIndex
					? {
							...player,
							cards: [...player.cards, action.card],
						}
					: player
			)
		default:
			return state
	}
}

export function usePlayerState(initialPlayers: Player[]) {
	const [players, dispatch] = useReducer(playerReducer, initialPlayers)

	const setPlayers = (players: Player[]) => {
		dispatch({ type: 'SET_PLAYERS', payload: players })
	}

	const updateHealth = (playerIndex: number, change: number) => {
		dispatch({ type: 'UPDATE_HEALTH', playerIndex, change })
	}

	const updateMana = (
		playerIndex: number,
		color: keyof ManaPool,
		change: number
	) => {
		dispatch({ type: 'UPDATE_MANA', playerIndex, color, change })
	}

	const clearManaPool = (playerIndex: number) => {
		dispatch({ type: 'CLEAR_MANA_POOL', playerIndex })
	}

	const updateTokenCount = (
		playerIndex: number,
		tokenIndex: number,
		change: number
	) => {
		dispatch({ type: 'UPDATE_TOKEN_COUNT', playerIndex, tokenIndex, change })
	}

	const addToken = (playerIndex: number, tokenName: string) => {
		dispatch({ type: 'ADD_TOKEN', playerIndex, tokenName })
	}

	const updateCard = (
		playerIndex: number,
		card: Card,
		cardIndex: number | null
	) => {
		if (cardIndex === null) {
			dispatch({ type: 'ADD_CARD', playerIndex, card })
			return
		}

		dispatch({ type: 'UPDATE_CARD', playerIndex, card, cardIndex })
	}

	const setNumPlayers = (numPlayers: number) => {
		const newPlayers = Array.from({ length: numPlayers }, (_, i) => {
			const existingPlayer = players[i]
			return (
				existingPlayer || {
					name: `Player ${i + 1}`,
					health: 20,
					tokens: [],
					manaPool: { ...initialManaPool },
					cards: [],
				}
			)
		})
		setPlayers(newPlayers)
	}

	return {
		players,
		setPlayers,
		updateHealth,
		updateMana,
		clearManaPool,
		updateTokenCount,
		addToken,
		updateCard,
		setNumPlayers,
	}
}

const GameStateContext = createContext<ReturnType<typeof usePlayerState>>({
	players: [],
	setPlayers: () => {},
	updateHealth: () => {},
	updateMana: () => {},
	clearManaPool: () => {},
	updateTokenCount: () => {},
	addToken: () => {},
	updateCard: () => {},
	setNumPlayers: () => {},
})

const useGameState = () => useContext(GameStateContext)

const GameStateProvider = ({ children }: { children: React.ReactNode }) => {
	const initialPlayers: Player[] = [
		{
			name: 'Player 1',
			health: 20,
			manaPool: { ...initialManaPool },
			tokens: [],
			cards: [],
		},
		{
			name: 'Player 2',
			health: 20,
			manaPool: { ...initialManaPool },
			tokens: [],
			cards: [],
		},
	]

	const gameState = usePlayerState(initialPlayers)

	console.log('gameState', gameState)

	return (
		<GameStateContext.Provider value={gameState}>
			{children}
		</GameStateContext.Provider>
	)
}

export { useGameState, GameStateProvider }
