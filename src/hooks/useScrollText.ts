import { useEffect, useState, useRef } from 'react'
import { Message } from './useAiChat'

const CHARACTERS_PER_SECOND = 1700
export const CHARACTER_INTERVAL = 60000 / CHARACTERS_PER_SECOND

const sentenceOrNewline = /([.!?]|\n)/g // Match punctuation or newlines

export default function useScrollText(message: Message, scroll: boolean) {
	const [typedContent, setTypedContent] = useState<string[]>([''])

	const currentSentenceIndex = useRef(0)
	const currentWordIndex = useRef(0)
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const currentRole = useRef(message.role)

	useEffect(() => {
		// Clear any existing timeout if effect re-runs
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current)
		}

		if (message.role !== currentRole.current) {
			setTypedContent([''])
			currentSentenceIndex.current = 0
			currentWordIndex.current = 0
			currentRole.current = message.role
		}

		const sentenceParts = message.content
			.split(sentenceOrNewline)
			.filter(Boolean)
		console.log(sentenceParts)

		// Initialize typing effect only if scrolling
		if (scroll && message.type === 'text') {
			const typeText = () => {
				// Stop typing when all sentences are typed
				if (currentSentenceIndex.current >= sentenceParts.length) {
					clearTimeout(typingTimeoutRef.current!)
					return
				}

				// Move to the next sentence if the current one is fully typed
				if (
					currentWordIndex.current >=
					sentenceParts[currentSentenceIndex.current]?.length
				) {
					currentWordIndex.current = 0
					currentSentenceIndex.current += 1
				}

				// Ensure we haven't run out of sentenceParts
				if (currentSentenceIndex.current < sentenceParts.length) {
					// Append the next character to typedContent
					const newChar =
						sentenceParts[currentSentenceIndex.current][
							currentWordIndex.current
						]
					setTypedContent((prev) =>
						newChar === '\n'
							? [...prev, '']
							: [...prev.slice(0, -1), prev[prev.length - 1] + newChar]
					)

					// Update word index
					currentWordIndex.current += 1

					// Schedule the next character typing
					typingTimeoutRef.current = setTimeout(typeText, CHARACTER_INTERVAL)
				}
			}

			// Start typing
			typeText()
		} else {
			// If not scrolling, set the full message immediately
			setTypedContent([message.content])
		}

		// Cleanup the timeout on component unmount or re-render
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current)
			}
		}
	}, [message, scroll])

	return {
		typedContent,
	}
}
