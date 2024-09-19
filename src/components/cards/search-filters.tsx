import useCards from "@/queries/useCards"
import { useCardSets } from "@/queries/useCardSets"
import { Dispatch } from "react"
import { Input } from "../ui/input"
import { Combobox } from "../ui/combobox"
import { Button } from "../ui/button"
import { Search } from "lucide-react"

export default function SearchFilters({
	searchTerm,
	setSearchTerm,
	selectedSetSearch,
	handleSetSet,
	cardsQuery,
	setsQuery,
	handleSearchSubmit,
}: {
	searchTerm: string
	setSearchTerm: Dispatch<string>
	selectedSetSearch: string | undefined
	handleSetSet: (set: string) => void
	cardsQuery: ReturnType<typeof useCards>['query']
	setsQuery: ReturnType<typeof useCardSets>
	handleSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}) {
	return (
		<form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
			<Input
				className="bg-gray-500"
				type="search"
				placeholder="Search for a card"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<Combobox
				options={
					setsQuery.data?.map((set) => ({
						label: set.name,
						value: set.code,
						icon: set.icon_svg_uri,
						number: set.card_count,
					})) || []
				}
				value={selectedSetSearch || ''}
				setValue={handleSetSet}
			/>
			<Button
				type="submit"
				disabled={cardsQuery.isLoading}
				className="bg-green-700"
			>
				<Search className="h-4 w-4 mr-2" />
				Search
			</Button>
		</form>
	)
}