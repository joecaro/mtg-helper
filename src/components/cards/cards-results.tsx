import { CardData } from '@/hooks/useCardSelection'
import { ScrollArea } from '../ui/scroll-area'
import useCards from '@/queries/useCards'
import { Button } from '../ui/button'
import Image from 'next/image'
import { Skeleton } from '../ui/skeleton'

export default function CardsResults({
	cardsQuery,
	selectCard,
}: {
	cardsQuery: ReturnType<typeof useCards>['query']
	selectCard: (card: CardData) => void
}) {
	return (
		<ScrollArea className="h-[300px]">
			{cardsQuery.error ? (
				<p>{cardsQuery.error.message}</p>
			) : cardsQuery.isLoading ? (
				<>
					<Skeleton className="h-24 my-2 w-full" />
					<Skeleton className="h-24 my-2 w-full" />
					<Skeleton className="h-24 my-2 w-full" />
					<Skeleton className="h-24 my-2w-full" />
				</>
			) : (
				cardsQuery.data?.map((card) => (
					<Button
						key={card.id}
						variant="ghost"
						className="my-2 w-full h-fit gap-5 grid grid-cols-2 bg-gray-500"
						onClick={() => selectCard(card)}
					>
						<div className="w-[58px] h-[81px] bg-slate-400 rounded ">
							{card.imageUrl ? (
								<Image
									alt="Card image"
									src={card.imageUrl}
									width={58}
									height={81}
									className="object-cover rounded"
								/>
							) : null}
						</div>
						<div className="flex flex-col gap-5 items-start">
							<span>{card.name}</span>
							<span>{card.setName}</span>
						</div>
					</Button>
				))
			)}
		</ScrollArea>
	)
}
