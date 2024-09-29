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

// Cards component
const Cards = ({
	players,
	updateCard,
}: {
	players: Player[]
	updateCard: (card: Card, cardIndex: number, playerIndex: number) => void
}) => {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)

	return (
		<Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
			<DialogTrigger asChild>
				<Button className="absolute bottom-4 left-4 p-2">Cards</Button>
			</DialogTrigger>
			<DialogContent className="">
				<DialogHeader>
					<DialogTitle>Player Cards</DialogTitle>
					{/* {players.map((player, playerIndex) => (
						<div key={player.name} className="mb-8">
							<h3 className="text-xl font-semibold">{player.name}'s Cards</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
								{player.cards.map((card, cardIndex) => (
									<Card
										key={player.name + card.name + cardIndex}
										card={card}
										index={cardIndex}
										updateCard={(updatedCard: Card, index: number) =>
											updateCard(updatedCard, index, playerIndex)
										}
									/>
								))}
								<Button
									onClick={() =>
										updateCard(
											{ name: '', power: 0, defense: 0, statuses: [] },
											player.cards.length,
											playerIndex
										)
									}
								>
									Add Card
								</Button>
							</div>
						</div>
					))} */}
					<div>NOT IMPLEMENTED YET</div>
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
