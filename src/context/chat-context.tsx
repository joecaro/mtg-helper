import { Message, useAiChat } from '@/hooks/useAiChat'
import { createContext, useContext, ReactNode } from 'react'
import { useCardsContext } from './card-context'

// Define the types for context data
type ChatContextType = {
	messages: Message[]
	streamedMessage: Message | null
	streaming: boolean
	isLoading: boolean
	handleSubmit: (prompt: string) => void
	handleImageGeneration: (prompt: string) => void
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Hook to use the Chat Context
export const useChatContext = () => {
	const context = useContext(ChatContext)
	if (!context) {
		throw new Error('useChat must be used within a ChatProvider')
	}
	return context
}

// ChatProvider component to wrap the app
export const ChatProvider = ({ children }: { children: ReactNode }) => {
	const { selectedCards } = useCardsContext()

	const {
		messages,
		streamedMessage,
		streaming,
		isLoading,
		handleSubmit,
		handleImageGeneration,
	} = useAiChat(selectedCards)

	return (
		<ChatContext.Provider
			value={{
				messages,
				streamedMessage,
				streaming,
				isLoading,
				handleSubmit,
				handleImageGeneration,
			}}
		>
			{children}
		</ChatContext.Provider>
	)
}
