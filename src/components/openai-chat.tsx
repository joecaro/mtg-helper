'use client'

import { Loader2, Send, Image as ImageIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import Cards from './cards'
import Chat from './chat'
import { useChatContext } from '@/context/chat-context'

export function OpenaiChat() {
	const {
		messages,
		input,
		isLoading,
		setInput,
		handleSubmit,
		handleImageGeneration,
	} = useChatContext()

	return (
		<div className="container mx-auto p-4 border-2 rounded-md flex-1 basis-1/2">
			<ReactQueryDevtools initialIsOpen={false} />
			<h2 className="text-2xl font-bold mb-4">Arcanis the Omnipotent Chat</h2>
			<Card className="mb-4">
				<CardContent>
					<ScrollArea className="h-[400px] p-4 bg-gray-500 rounded-md">
						<Chat messages={messages} />
						{isLoading && (
							<div className="flex items-center text-gray-500">
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Thinking...
							</div>
						)}
					</ScrollArea>
				</CardContent>
			</Card>
			<form onSubmit={handleSubmit} className="flex gap-2 mb-4">
				<Input
					type="text"
					value={input}
					onChange={(e) => setInput(e.currentTarget.value)}
					placeholder="Ask a question or describe an image..."
					className="flex-grow bg-gray-500 placeholder:text-slate-200"
				/>
				<Button type="submit" className="bg-green-700" disabled={isLoading}>
					<Send className="mr-2 h-4 w-4" />
					{isLoading ? 'Thinking' : 'Send'}
				</Button>
				<Button
					type="button"
					className="bg-gray-700"
					onClick={handleImageGeneration}
					disabled={isLoading}
				>
					<ImageIcon className="mr-2 h-4 w-4" />
					Generate Image
				</Button>
			</form>
			<Cards />
		</div>
	)
}
