import { Message, useAiChat } from '@/hooks/useAiChat'
import useCardSelection, { CardData } from '@/hooks/useCardSelection'
import { createContext, useContext, ReactNode } from 'react'

// Define the types for context data
type CardContextType = {
	selectedCards: (null | CardData)[]
	isSearchModalOpen: boolean
	activeSlot: number | null
	setIsSearchModalOpen: (isOpen: boolean) => void
	selectCard: (card: CardData) => void
	handleSlotClick: (slot: number) => void
	handleClearSlot: (slot: number) => void
}

// Create the context
const CardContext = createContext<CardContextType | undefined>(undefined)

// Hook to use the Chat Context
export const useCardsContext = () => {
	const context = useContext(CardContext)
	if (!context) {
		throw new Error('useCard must be used within a CardProvider')
	}
	return context
}

// CardProvider component to wrap the app
export const CardProvider = ({ children }: { children: ReactNode }) => {
	const {
		selectedCards,
		isSearchModalOpen,
		activeSlot,
		setIsSearchModalOpen,
		selectCard,
		handleSlotClick,
		handleClearSlot,
	} = useCardSelection()

	return (
		<CardContext.Provider
			value={{
				selectedCards,
				isSearchModalOpen,
				activeSlot,
				setIsSearchModalOpen,
				selectCard,
				handleSlotClick,
				handleClearSlot,
			}}
		>
			{children}
		</CardContext.Provider>
	)
}
