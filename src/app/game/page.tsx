import GameUI from '@/components/game-tracker'
import { GameStateProvider } from '@/components/game-tracker/player-state'
import { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
	title: 'MTG Help Me',
	description: 'Elevating the Magic: The Gathering Game Stats Tracking',
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
}

export default function Page(): JSX.Element {
	return (
		<GameStateProvider>
			<GameUI />
		</GameStateProvider>
	)
}
