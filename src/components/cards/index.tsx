import { useState } from 'react'
import { useCardSets } from '@/queries/useCardSets'
import useCards from '@/queries/useCards'
import { useCardsContext } from '@/context/card-context'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'

import Card from './card'
import SearchFilters from './search-filters'
import CardsResults from './cards-results'

export default function Cards() {
	const {
		selectedCards,
		selectCard,
		isSearchModalOpen,
		setIsSearchModalOpen,
		activeSlot,
	} = useCardsContext()

	const [selectedSetSearch, setSelectedSetSearch] = useState<
		string | undefined
	>('')
	const [selectedSet, setSelectedSet] = useState<string | undefined>(undefined)
	const [searchTerm, setSearchTerm] = useState<string>('')

	const setsQuery = useCardSets()
	const { query: cardsQuery, fetchData } = useCards()

	const handleSetSet = (set: string) => {
		setSelectedSet(set)
		setSelectedSetSearch(set)
	}

	const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		fetchData({ set: selectedSet, name: searchTerm })
	}
	return (
		<div className="mt-4 grid grid-cols-4 justify-items-center gap-2">
			{selectedCards.map((card, index) => (
				<Dialog
					key={index}
					open={isSearchModalOpen && activeSlot === index}
					onOpenChange={setIsSearchModalOpen}
				>
					<DialogTrigger asChild>
						<Card card={card} index={index} />
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Search for a Card</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<SearchFilters
								searchTerm={searchTerm}
								setSearchTerm={setSearchTerm}
								selectedSetSearch={selectedSetSearch}
								handleSetSet={handleSetSet}
								cardsQuery={cardsQuery}
								setsQuery={setsQuery}
								handleSearchSubmit={handleSearchSubmit}
							/>
							<CardsResults cardsQuery={cardsQuery} selectCard={selectCard} />
						</div>
					</DialogContent>
				</Dialog>
			))}
		</div>
	)
}
