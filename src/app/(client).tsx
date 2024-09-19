'use client'

import { CardProvider } from '@/context/card-context'
import { ChatProvider } from '@/context/chat-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
		},
	},
})

export default function ClientApp({ children }: PropsWithChildren) {
	return (
		<QueryClientProvider client={queryClient}>
			<CardProvider>
				<ChatProvider>{children}</ChatProvider>
			</CardProvider>
		</QueryClientProvider>
	)
}
