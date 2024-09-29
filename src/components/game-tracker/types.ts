// Types
export interface Token {
	name: string
	count: number
}

export interface ManaPool {
	white: number
	blue: number
	black: number
	red: number
	green: number
	colorless: number
}

export interface Card {
	name: string
	power: number
	defense: number
	statuses: string[]
}

export interface Player {
	name: string
	health: number
	tokens: Token[]
	manaPool: ManaPool
	cards: Card[]
}
