import { useMemo, useState } from 'react'
import { useGameState } from './player-state'
import { MinusCircle, PlusCircle, Shield, Sword } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from './types'

export default function PlayerCards({
	playerIndex,
}: {
	playerIndex: number
}): JSX.Element {
	const { players, updateCard, addCard } = useGameState()

	const playerCards = useMemo(
		() => players[playerIndex].cards,
		[players, playerIndex]
	)
	const [card, setCard] = useState<Card>({
		id: 0,
		name: '',
		power: 0,
		defense: 0,
		statuses: [],
	})

	const handleAddCard = () => {
		addCard(playerIndex, card)
		setCard({ id: 0, name: '', power: 0, defense: 0, statuses: [] })
	}

	return (
		<div className="flex flex-col h-full">
			<h3 className="text-xl font-semibold">Player {playerIndex + 1} Cards</h3>
			<div className="max-h-80 overflow-y-scroll">
				<div className="flex flex-wrap gap-4">
					{playerCards.map((card, cardIdx) => (
						<CardEditor
							key={cardIdx}
							card={card}
							editCardDetail={(key: keyof Card, value: string | number) => {
								updateCard(playerIndex, { ...card, [key]: value })
							}}
						/>
					))}
					<CardEditor
						card={card}
						editCardDetail={(key: keyof Card, value: string | number) =>
							setCard({ ...card, [key]: value })
						}
						handleAddCard={handleAddCard}
					/>
				</div>
			</div>
		</div>
	)
}

function CardEditor({
	card,
	editCardDetail,
	handleAddCard,
}: {
	card: Card
	editCardDetail: (key: keyof Card, value: string | number) => void
	handleAddCard?: () => void
}): JSX.Element {
	return (
		<div className="flex flex-col items-center justify-between gap-2 max-w-44 max-h-fit border rounded-md p-2">
			<Input
				type="text"
				placeholder="Enter Card Name"
				value={card.name}
				onChange={(e) => editCardDetail('name', e.currentTarget.value)}
			/>
			<NumberField
				Icon={Sword}
				cardKey="power"
				value={card.power}
				editCardDetail={editCardDetail}
			/>
			<NumberField
				Icon={Shield}
				cardKey="defense"
				value={card.defense}
				editCardDetail={editCardDetail}
			/>
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

function NumberField({
	Icon,
	cardKey,
	value,
	editCardDetail,
}: {
	Icon: React.FC
	cardKey: keyof Card
	value: number
	editCardDetail: (cardKey: keyof Card, value: string | number) => void
}) {
	return (
		<div className="flex items-center">
			<Icon />
			<div className="flex items-center">
				<Button
					variant="outline"
					className="border-none"
					size="sm"
					onClick={() => editCardDetail(cardKey, value > 0 ? value - 1 : 0)}
				>
					<MinusCircle size={24} />
				</Button>
				<Input
					type="number"
					className="min-w-10"
					value={value}
					onChange={(e) => editCardDetail(cardKey, e.currentTarget.value)}
				/>
				<Button
					variant="outline"
					size="sm"
					className="border-none"
					onClick={() => editCardDetail(cardKey, value + 1)}
				>
					<PlusCircle size={24} />
				</Button>
			</div>
		</div>
	)
}
