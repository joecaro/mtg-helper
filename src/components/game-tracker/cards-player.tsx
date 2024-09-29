import { useMemo, useState } from 'react'
import { useGameState } from './player-state'
import { MinusCircle, PlusCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from './types'

export default function PlayerCards({
	playerIndex,
}: {
	playerIndex: number
}): JSX.Element {
	const { players, updateCard } = useGameState()

	const playerCards = useMemo(
		() => players[playerIndex].cards,
		[players, playerIndex]
	)
	const [card, setCard] = useState<Card>({
		name: '',
		power: 0,
		defense: 0,
		statuses: [],
	})

	const editCardDetail = (
		key: keyof Card,
		value: string | number,
		idx?: number
	) => {
		if (idx) {
			updateCard(playerIndex, { ...playerCards[idx], [key]: value }, idx)
		} else {
			setCard({ ...card, [key]: value })
		}
	}

	const handleAddCard = () => {
		updateCard(playerIndex, card, null)
		setCard({ name: '', power: 0, defense: 0, statuses: [] })
	}

	return (
		<div className="space-y-4">
			<h3 className="text-xl font-semibold">Cards</h3>
			<div className="flex flex-wrap overflow-y-auto h-64 sm:h-96">
				{playerCards.map((card, cardIdx) => (
					<CardEditor
						key={card.name + cardIdx}
						card={card}
						cardIdx={cardIdx}
						editCardDetail={editCardDetail}
					/>
				))}
				<CardEditor
					card={card}
					editCardDetail={editCardDetail}
					handleAddCard={handleAddCard}
				/>
			</div>
		</div>
	)
}

function CardEditor({
	card,
	cardIdx,
	editCardDetail,
	handleAddCard,
}: {
	card: Card
	cardIdx?: number
	editCardDetail: (
		key: keyof Card,
		value: string | number,
		idx?: number
	) => void
	handleAddCard?: () => void
}): JSX.Element {
	return (
		<div className="flex flex-col items-center justify-between gap-2 max-w-52 max-h-fit border rounded-md p-2">
			<Input
				type="text"
				placeholder="Enter Card Name"
				value={card.name}
				onChange={(e) => editCardDetail('name', e.currentTarget.value, cardIdx)}
			/>
			<div>
				<p>Power:</p>
				<div className="flex">
					<Input
						type="number"
						value={card.power}
						onChange={(e) =>
							editCardDetail('power', e.currentTarget.value, cardIdx)
						}
					/>
					<Button
						variant="outline"
						onClick={(e) => editCardDetail('power', card.power - 1, cardIdx)}
					>
						<MinusCircle size={24} />
					</Button>
					<Button
						variant="outline"
						onClick={(e) => editCardDetail('power', card.power + 1, cardIdx)}
					>
						<PlusCircle size={24} />
					</Button>
				</div>
			</div>
			<div>
				<p>Defense:</p>
				<div className="flex">
					<Input
						type="number"
						value={card.defense}
						onChange={(e) =>
							editCardDetail('defense', e.currentTarget.value, cardIdx)
						}
					/>
					<Button
						variant="outline"
						onClick={(e) =>
							editCardDetail('defense', card.defense - 1, cardIdx)
						}
					>
						<MinusCircle size={24} />
					</Button>
					<Button
						variant="outline"
						onClick={(e) =>
							editCardDetail('defense', card.defense + 1, cardIdx)
						}
					>
						<PlusCircle size={24} />
					</Button>
				</div>
			</div>

			{handleAddCard && (
				<div className="flex items-center space-x-2">
					<Button variant="ghost" onClick={handleAddCard}>
						Add Card
					</Button>
				</div>
			)}
		</div>
	)
}
