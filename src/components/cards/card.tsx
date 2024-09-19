import Image from 'next/image'
import { Button } from '../ui/button'
import { useCardsContext } from '@/context/card-context'
import { CardData } from '@/hooks/useCardSelection'

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { useChatContext } from '@/context/chat-context'
import { toast } from 'sonner'

import {
	Box,
	Briefcase,
	Diamond,
	Expand,
	Shield,
	Star,
	Trash,
	Type,
	Users,
	Zap,
} from 'lucide-react'
import { PropsWithChildren, useState } from 'react'
import { cn } from '@/lib/utils'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from '../ui/dialog'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { ScrollArea } from '@radix-ui/react-scroll-area'

export default function Card({
	card,
	index,
}: {
	card: CardData | null
	index: number
}) {
	const { handleSlotClick } = useCardsContext()

	const [expanded, setExpanded] = useState(false)

	const handleExpand = () => {
		setExpanded((prev) => !prev)
	}

	return (
		<CardContextMenu card={card} index={index} expand={handleExpand}>
			<Button
				variant="outline"
				className="h-[105px] w-[80px] p-0 relative bg-gray-500 hover:bg-slate-700"
				onClick={() => handleSlotClick(index)}
				title="Right click for more options"
			>
				{card?.imageUrl ? (
					<Image
						alt="Card image"
						src={card.imageUrl}
						width={80}
						height={105}
						className={cn('object-cover')}
					/>
				) : null}
			</Button>
		</CardContextMenu>
	)
}

export function CardContextMenu({
	card,
	index,
	expand,
	children,
}: PropsWithChildren<{
	card: CardData | null
	index: number
	expand: () => void
}>) {
	const { handleClearSlot } = useCardsContext()

	const { handleSubmit } = useChatContext()

	if (!card) {
		return <>{children}</>
	}

	const handleQuickChat = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		type: 'details' | 'strategy' | 'pair'
	) => {
		e.preventDefault()
		e.stopPropagation()
		handleSubmit(`Get ${type} for ${card.name}`)
	}

	return (
		<Dialog>
			<ContextMenu>
				<ContextMenuTrigger className="">{children}</ContextMenuTrigger>
				<ContextMenuContent className="w-64">
					<DialogTrigger className="w-full">
						<ContextMenuItem onClick={expand} className="justify-between">
							View Card
							<Expand className="w-4 h-4" />
						</ContextMenuItem>
					</DialogTrigger>
					<ContextMenuSeparator />
					<ContextMenuSub>
						<ContextMenuSubTrigger inset>Quick Chat</ContextMenuSubTrigger>
						<ContextMenuSubContent className="w-48">
							<ContextMenuItem onClick={(e) => handleQuickChat(e, 'details')}>
								Get Card Details
							</ContextMenuItem>
							<ContextMenuItem onClick={(e) => handleQuickChat(e, 'strategy')}>
								Get Card Strategy
							</ContextMenuItem>
							<ContextMenuSeparator />
							<ContextMenuItem onClick={(e) => handleQuickChat(e, 'pair')}>
								Get Best Paired Cards
							</ContextMenuItem>
						</ContextMenuSubContent>
					</ContextMenuSub>
					<ContextMenuSeparator />
					<ContextMenuItem
						onClick={() => {
							navigator.clipboard.writeText(card.imageUrl || '')
							toast.success('Card link copied to clipboard')
						}}
					>
						Share Card
					</ContextMenuItem>
					<ContextMenuItem
						onClick={() => {
							navigator.clipboard.writeText(JSON.stringify(card) || '')
							toast.success('Card details copied to clipboard')
						}}
					>
						Copy Card
					</ContextMenuItem>
					<ContextMenuSeparator />
					<ContextMenuItem
						onClick={() => {
							handleClearSlot(index)
						}}
						className="justify-between text-red-500 hover:bg-red-300"
					>
						Remove Card
						<Trash className="w-4 h-4" />
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
			<Stats card={card} />
		</Dialog>
	)
}

function Stats({ card }: { card: CardData }) {
	return (
		<DialogContent className="sm:max-w-[700px] bg-gray-800 text-white">
			<DialogHeader>
				<DialogTitle className="text-2xl font-bold">
					{card.name || 'Unknown Card'}
				</DialogTitle>
				<DialogDescription>
					<span className="text-gray-400">{card.type || 'Unknown Type'}</span>
				</DialogDescription>
			</DialogHeader>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<img
						src={card.imageUrl || '/placeholder.svg?height=300&width=223'}
						alt={card.name || 'Card image'}
						className="w-full rounded-lg shadow-lg"
					/>
				</div>
				<ScrollArea className="h-[400px] rounded-md border p-4 overflow-auto">
					<div className="space-y-4">
						<InfoItem
							icon={<Box />}
							label="Set"
							value={`${card.setName || 'Unknown Set'} (${card.set || 'N/A'})`}
						/>
						<InfoItem
							icon={<Type />}
							label="Type"
							value={card.type || 'Unknown'}
						/>
						<InfoItem
							icon={<Diamond />}
							label="Rarity"
							value={card.rarity || 'Unknown'}
						/>
						<InfoItem
							icon={<Star />}
							label="Mana Cost"
							value={card.manaCost || 'N/A'}
						/>
						<InfoItem
							icon={<Zap />}
							label="CMC"
							value={card.cmc?.toString() || 'N/A'}
						/>
						<InfoItem
							icon={<Users />}
							label="Artist"
							value={card.artist || 'Unknown'}
						/>
						{card.power && card.toughness && (
							<InfoItem
								icon={<Shield />}
								label="P/T"
								value={`${card.power}/${card.toughness}`}
							/>
						)}
						<InfoItem icon={<Briefcase />} label="Rulings" value="" />
						<Accordion type="single" collapsible>
							{card.rulings &&
								card.rulings.length > 0 &&
								card.rulings.map((rule) => (
									<AccordionItem key={rule.date} value={rule.date}>
										<AccordionTrigger>{rule.date}</AccordionTrigger>
										<AccordionContent>{rule.text}</AccordionContent>
									</AccordionItem>
								))}
						</Accordion>
					</div>
				</ScrollArea>
			</div>
		</DialogContent>
	)
}

function InfoItem({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode
	label: string
	value: string
}) {
	return (
		<div className="flex items-center gap-2">
			{icon}
			<span className="font-semibold">{label}:</span>
			<span>{value}</span>
		</div>
	)
}
