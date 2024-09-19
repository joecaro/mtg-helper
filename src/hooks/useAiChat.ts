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

*Click a card slot below if you'd like to ask about a specific card or group of cards.*
`,
	type: 'text',
}

export function useAiChat(selectedCards: (null | CardData)[]) {
	const [streaming, setStreaming] = useState(true)
	const [latestMessage, setLatestMessage] = useState<Message | null>(
		firstMessage
	)
	const [streamedMessage, setStreamedMessage] = useState<Message | null>(null)
	const [messages, setMessages] = useState<Message[]>([firstMessage])
	const [isLoading, setIsLoading] = useState(false)
	const currentIndex = useRef(0)
	const currentInterval = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		if (streaming && latestMessage && !currentInterval.current) {
			const wordsPerSecond = 3
			const interval = 1000 / wordsPerSecond

			// Split the latest message content into words
			const words = latestMessage.content.split(' ')
			const totalWords = words.length
			let currentWordIndex = 0

			const intervalId = setInterval(() => {
				// Increment by 4 words at each interval
				currentWordIndex += wordsPerSecond

				// Slice the content up to the current word index
				const currentContent = words.slice(0, currentWordIndex).join(' ')

				// Update the streamed message progressively
				setStreamedMessage({
					role: latestMessage.role,
					content: currentContent,
					type: latestMessage.type,
				})

				// When the full message is shown, stop streaming
				if (currentIndex.current >= latestMessage.content.length) {
					currentInterval.current && clearInterval(currentInterval.current)
					currentInterval.current = null
					setStreaming(false)
					setLatestMessage(null)
				}
			}, interval) // Update every 100ms

			return () => {}
		}
	}, [streaming, latestMessage])

	const handleSubmit = useCallback(
		async (prompt: string) => {
			if (!prompt.trim()) return

			const newMessage: Message = {
				role: 'user',
				content: prompt,
				type: 'text',
			}
			setMessages((prev) => [...prev, newMessage])
			setIsLoading(true)

			try {
				const response = await fetch('/api/openai', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						messages: [
							...messages
								.filter((m) => m.type === 'image')
								.map((m) => ({
									role: m.role,
									content: m.content,
								})),
							{
								role: newMessage.role,
								content: `User Provided Cards: ${JSON.stringify(
									selectedCards
								)} User Message: ${newMessage.content}`,
							},
						],
					}),
				})

				if (!response.ok) throw new Error('Failed to get response')

				const data = await response.json()
				setMessages((prev) => [
					...prev,
					{ role: 'assistant', content: data.message, type: 'text' },
				])
				setLatestMessage({
					role: 'assistant',
					content: data.message,
					type: 'text',
				})
				setStreaming(true)
			} catch (error) {
				console.error('Error:', error)
				setMessages((prev) => [
					...prev,
					{
						role: 'assistant',
						content: 'Sorry, there was an error processing your request.',
						type: 'text',
					},
				])
			} finally {
				setIsLoading(false)
			}
		},
		[selectedCards, messages]
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
			setMessages((prev) => [
				...prev,
				{
					role: 'assistant',
					content: data.imageUrl,
					type: 'image',
				},
			])
		} catch (error) {
			console.error('Error:', error)
			setMessages((prev) => [
				...prev,
				{
					role: 'assistant',
					content: 'Sorry, there was an error generating the image.',
					type: 'text',
				},
			])
		} finally {
			setIsLoading(false)
		}
	}

	return {
		messages,
		streamedMessage,
		streaming,
		isLoading,
		handleSubmit,
		handleImageGeneration,
	}
}
