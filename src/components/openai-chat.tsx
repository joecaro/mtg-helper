'use client'

import { useState } from 'react'
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
	const [input, setInput] = useState('')
	const { isLoading, handleSubmit, handleImageGeneration } =
		useChatContext()

	return (
		<div className="container mx-auto p-4 border-2 rounded-md flex-1 basis-1/2">
			<ReactQueryDevtools initialIsOpen={false} />
			<h2 className="text-3xl font-bold mb-4">Arcanis the Omnipotent Chat</h2>
			<div className="p-4 bg-gray-500 rounded-md">
				<Card className="mb-4">
					<CardContent>
						<ScrollArea className="h-[350px] bg-slate-950">
							<Chat />
						</ScrollArea>
					</CardContent>
				</Card>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						handleSubmit(input)
						setInput('')
					}}
					className="flex gap-2 mb-4"
				>
					<Input
						type="text"
						value={input}
						onChange={(e) => setInput(e.currentTarget.value)}
						placeholder="Ask a question or describe an image..."
						className="flex-grow bg-gray-600 placeholder:text-slate-200"
					/>
					<Button type="submit" className="bg-cyan-800" disabled={isLoading}>
						<Send className="mr-2 h-4 w-4" />
						{isLoading ? 'Thinking' : 'Send'}
					</Button>
					<Button
						type="button"
						className="bg-amber-900"
						onClick={(e) => {
							e.preventDefault()
							handleImageGeneration(input)
							setInput('')
						}}
						disabled={isLoading}
					>
						<ImageIcon className="mr-2 h-4 w-4" />
						Generate Image
					</Button>
				</form>
			</div>
			<Cards />
		</div>
	)
}
