import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import ReactMarkdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import { useChatContext } from '@/context/chat-context'
import { Loader2 } from 'lucide-react'
import { Message } from '@/hooks/useAiChat'
import useScrollText from '@/hooks/useScrollText'

export default function Chat() {
	const { messages, latestMessage, isLoading } = useChatContext()

	const containerRef = useRef<HTMLDivElement>(null)

	const [isUserAtBottom, setIsUserAtBottom] = useState(true)

	// Scroll to the bottom when a new message is added, but only if the user is at the bottom
	useEffect(() => {
		if (isUserAtBottom && containerRef.current) {
			requestAnimationFrame(() => {
				if (!containerRef.current) return
				containerRef.current.scrollTo({
					top: containerRef.current.scrollHeight,
					behavior: 'smooth',
				})
			})
		}
	}, [latestMessage, isUserAtBottom])

	// Check if the user is at the bottom
	const handleScroll = () => {
		if (containerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } = containerRef.current
			setIsUserAtBottom(scrollTop + clientHeight >= scrollHeight - 5)
		}
	}

	return (
		<div
			ref={containerRef}
			onScroll={handleScroll}
			className="overflow-y-auto h-full p-4 bg-50 rounded-md"
		>
			{messages.map((message, index) => (
				<MarkedDown message={message} key={'message' + index} />
			))}
			{latestMessage && <MarkedDown scroll message={latestMessage} />}
			{isLoading && (
				<div className="flex items-center text-gray-500">
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Thinking...
				</div>
			)}
		</div>
	)
}

function MarkedDown({
	message,
	scroll = false,
}: {
	message: Message
	scroll?: boolean
}) {
	const { typedContent } = useScrollText(message, scroll)

	return (
		<div
			key={message.role + message.content}
			className={`mb-4 ${
				message.role === 'assistant' ? 'text-green-400' : 'text-slate-50'
			}`}
		>
			<strong>{message.role === 'assistant' ? 'AI: ' : 'You: '}</strong>
			{message.type === 'text' ? (
				<>
					{typedContent.map((string) => (
						<ReactMarkdown
							key={string}
							rehypePlugins={[rehypeSlug]}
							remarkPlugins={[remarkGfm]}
							components={{
								br: () => <br className="block" />,
							}}
						>
							{string}
						</ReactMarkdown>
					))}
				</>
			) : (
				<Image
					alt="Generated image"
					src={message.content}
					width={300}
					height={300}
					className="object-cover rounded-md"
				/>
			)}
		</div>
	)
}
