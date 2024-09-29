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
import { Input } from '../ui/input'
import { useGameState } from './player-state'
import PlayerCards from './cards-player'

// Types
interface Card {
	name: string
	power: number
	defense: number
	statuses: string[]
}

interface Player {
	name: string
	cards: Card[]
}

const Cards = () => {
	const { players, updateCard } = useGameState()
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)

	return (
		<Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
			<DialogTrigger asChild>
				<Button className="absolute bottom-4 left-4 p-2">Cards</Button>
			</DialogTrigger>
			<DialogContent className="">
				<DialogHeader>
					<DialogTitle>Player Cards</DialogTitle>
					{players.map((player, playerIndex) => (
						<div
							key={player.name + playerIndex}
							className={` ${(players.length === 4 ? playerIndex < 2 : playerIndex % 2 === 0) ? 'transform rotate-180' : ''}`}
						>
							<PlayerCards
								key={player.name + playerIndex}
								playerIndex={playerIndex}
							/>
						</div>
					))}
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

// Single Card Component
const Card = ({
	card,
	index,
	updateCard,
}: {
	card: Card
	index: number
	updateCard: (card: Card, cardIndex: number) => void
}) => {
	const updatePower = useCallback(
		(change: number) => {
			updateCard({ ...card, power: Math.max(0, card.power + change) }, index)
		},
		[updateCard, card, index]
	)

	const updateDefense = useCallback(
		(change: number) => {
			updateCard(
				{ ...card, defense: Math.max(0, card.defense + change) },
				index
			)
		},
		[updateCard, card, index]
	)

	const addStatus = useCallback(
		(status: string) => {
			updateCard({ ...card, statuses: [...card.statuses, status] }, index)
		},
		[updateCard, card, index]
	)

	const removeStatus = useCallback(
		(status: string) => {
			updateCard(
				{
					...card,
					statuses: card.statuses.filter((s) => s !== status),
				},
				index
			)
		},
		[updateCard, card, index]
	)

	const updateName = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			updateCard({ ...card, name: e.currentTarget.value }, index)
		},
		[updateCard, card, index]
	)

	return (
		<div className="p-4 bg-gray-500 rounded-md">
			<Input type="text" value={card.name} onChange={updateName} />
			<div className="grid grid-cols-2 gap-4">
				<div>
					<p>Power: {card.power}</p>
					<Button onClick={() => updatePower(-1)}>-</Button>
					<Button onClick={() => updatePower(1)}>+</Button>
				</div>
				<div>
					<p>Defense: {card.defense}</p>
					<Button onClick={() => updateDefense(-1)}>-</Button>
					<Button onClick={() => updateDefense(1)}>+</Button>
				</div>
				<div>
					<p>Statuses:</p>
					<ul>
						{card.statuses.map((status) => (
							<li key={status} className="flex items-center justify-between">
								{status}
								<Button onClick={() => removeStatus(status)} className="ml-2">
									Remove
								</Button>
							</li>
						))}
					</ul>
					<InputWithButton addStatus={addStatus} />
				</div>
			</div>
		</div>
	)
}

// InputWithButton Component for Adding Statuses
const InputWithButton = ({
	addStatus,
}: {
	addStatus: (status: string) => void
}) => {
	const [newStatus, setNewStatus] = useState('')

	const handleAddStatus = () => {
		if (newStatus.trim()) {
			addStatus(newStatus.trim())
			setNewStatus('')
		}
	}

	return (
		<div className="flex items-center mt-2">
			<input
				type="text"
				value={newStatus}
				onChange={(e) => setNewStatus(e.target.value)}
				placeholder="Add status"
				className="border rounded p-2 w-full"
			/>
			<Button className="ml-2" onClick={handleAddStatus}>
				Add
			</Button>
		</div>
	)
}

export default Cards
