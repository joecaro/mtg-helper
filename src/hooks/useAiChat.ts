import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { CardData } from './useCardSelection'

export type Message = {
	role: 'user' | 'assistant'
	content: string
	type: 'text' | 'image'
}

// markdown message
const firstMessage: Message = {
	role: 'assistant',
	content: `**Welcome,**
I am **Arcanis**, your Magic: The Gathering companion!
Ask me anything about Magic: The Gathering, whether it’s about **cards, sets, rules, or strategies**. I will do my best to provide you with the information you need.
*Click a card slot below if you'd like to ask about a specific card or group of cards.*`,
	type: 'text',
}

type ReducerState = {
	messages: Message[]
	latestMessage: Message
}

const messageReducer = (state: ReducerState, action: Message) => {
	return {
		messages: [...state.messages, state.latestMessage],
		latestMessage: action,
	}
}

export function useAiChat(selectedCards: (null | CardData)[]) {
	const [{ messages, latestMessage }, dispatch] = useReducer(messageReducer, {
		messages: [],
		latestMessage: firstMessage,
	})
	
	const [isLoading, setIsLoading] = useState(false)

	const addNewMessage = useCallback((message: Message) => {
		dispatch(message)
	}, [])

	const handleSubmit = useCallback(
		async (prompt: string) => {
			if (!prompt.trim()) return

			const newMessage: Message = {
				role: 'user',
				content: prompt,
				type: 'text',
			}

			addNewMessage(newMessage)
			setIsLoading(true)

			try {
				const previousImageMessages = messages
					.filter((m) => m.type === 'image')
					.map((m) => ({
						role: m.role,
						content: m.content,
					}))

				const payload = {
					messages: [
						...previousImageMessages,
						{
							role: newMessage.role,
							content: `User Provided Cards: ${JSON.stringify(
								selectedCards
							)} User Message: ${newMessage.content}`,
						},
					],
				}

				const response = await fetch('/api/openai', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				})

				if (!response.ok) throw new Error('Failed to get response')

				const data = await response.json()

				addNewMessage({
					role: 'assistant',
					content: data.message,
					type: 'text',
				})
			} catch (error) {
				console.error('Error:', error)

				addNewMessage({
					role: 'assistant',
					content: 'Sorry, there was an error processing your request.',
					type: 'text',
				})
			} finally {
				setIsLoading(false)
			}
		},
		[selectedCards, messages, addNewMessage]
	)

	const handleImageGeneration = async (prompt: string) => {
		setIsLoading(true)
		try {
			const response = await fetch('/api/openai-image', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt }),
			})

			if (!response.ok) throw new Error('Failed to generate image')

			const data = await response.json()
			addNewMessage({
				role: 'assistant',
				content: data.imageUrl,
				type: 'image',
			})
		} catch (error) {
			console.error('Error:', error)
			addNewMessage({
				role: 'assistant',
				content: 'Sorry, there was an error generating the image.',
				type: 'text',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return {
		messages,
		latestMessage,
		isLoading,
		handleSubmit,
		handleImageGeneration,
	}
}
