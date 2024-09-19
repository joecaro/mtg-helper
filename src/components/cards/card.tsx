import Image from 'next/image'
import { Button } from '../ui/button'
import { useCardsContext } from '@/context/card-context'
import { CardData } from '@/hooks/useCardSelection'

export default function Card({
	card,
	index,
}: {
	card: CardData | null
	index: number
}) {
	const { handleSlotClick, handleClearSlot } = useCardsContext()
	return (
		<Button
			variant="outline"
			className="h-[105px] w-[80px] p-0 relative bg-gray-500 hover:bg-slate-700"
			onClick={() => handleSlotClick(index)}
		>
			{card?.imageUrl ? (
				<Image
					alt="Card image"
					src={card.imageUrl}
					width={80}
					height={105}
					className="object-cover"
				/>
			) : null}
			<span
				onClick={(e) => {
					e.stopPropagation()
					handleClearSlot(index)
				}}
				className={`absolute -top-2 -right-2 py-1 px-2 rounded-full text-white text-xs 
hover:bg-red-400 bg-red-600
                                    ${card ? 'visible' : 'invisible'}`}
			>
				{card ? 'X' : '+'}
			</span>
		</Button>
	)
}
