'use client'

import { Minus, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useMemo, useState } from 'react'
import { useGameState } from './player-state'

const TokenControl = ({ playerIndex }: { playerIndex: number }) => {
	const { players, updateTokenCount, addToken } = useGameState()
	const tokens = useMemo(
		() => players[playerIndex].tokens,
		[players, playerIndex]
	)
	const [tokenInput, setTokenInput] = useState('')
	return (
		<div className="space-y-4">
			<h3 className="text-xl font-semibold">Tokens</h3>
			{tokens.map((token, tokenIndex) => (
				<div key={tokenIndex} className="flex items-center justify-between">
					<span className="text-lg">{token.name}</span>
					<div className="flex items-center space-x-2">
						<Button
							size="icon"
							variant="outline"
							onClick={() => updateTokenCount(playerIndex, tokenIndex, -1)}
						>
							<Minus className="h-4 w-4" />
						</Button>
						<span className="text-lg font-medium w-8 text-center">
							{token.count}
						</span>
						<Button
							size="icon"
							variant="outline"
							onClick={() => updateTokenCount(playerIndex, tokenIndex, 1)}
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				</div>
			))}
			<div className="mt-4 flex space-x-2">
				<Input
					type="text"
					placeholder="New token name"
					value={tokenInput}
					onChange={(e) => setTokenInput(e.target.value)}
					onKeyDown={(e) =>
						e.key === 'Enter' && addToken(playerIndex, tokenInput)
					}
				/>
				<Button onClick={() => addToken(playerIndex, tokenInput)}>
					Add Token
				</Button>
			</div>
		</div>
	)
}
export default TokenControl
