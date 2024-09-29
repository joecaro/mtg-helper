import GameUI from '@/components/game-tracker'
import { GameStateProvider } from '@/components/game-tracker/player-state'

export default function Page(): JSX.Element {
	return (
		<GameStateProvider>
			<GameUI />
		</GameStateProvider>
	)
}
