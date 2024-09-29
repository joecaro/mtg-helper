'use client'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useGameState } from './player-state'

const Settings = () => {
	const { setNumPlayers } = useGameState()
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)
	return (
		<Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
			<DialogTrigger asChild>
				<Button className="absolute bottom-4 right-4 p-2 hidden sm:block">
					⚙️ Settings
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<p>Number of players</p>
					<Button onClick={() => setNumPlayers(2)}>2 Players</Button>
					<Button onClick={() => setNumPlayers(4)}>4 Players</Button>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

export default Settings
