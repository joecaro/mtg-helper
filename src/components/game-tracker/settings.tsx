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

const Settings = ({ setPlayers }: { setPlayers: (num: 2 | 4) => void }) => {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)
	return (
		<Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
			<DialogTrigger asChild>
				<Button className="absolute bottom-4 right-4 p-2">⚙️ Settings</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<p>Number of players</p>
					<Button onClick={() => setPlayers(2)}>2 Players</Button>
					<Button onClick={() => setPlayers(4)}>4 Players</Button>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

export default Settings
