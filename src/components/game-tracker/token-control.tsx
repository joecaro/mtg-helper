'use client'

import { Minus, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Token } from './types'

// Token control component
const TokenControl = ({
	playerIndex,
	tokens,
	updateTokenCount,
	addToken,
	newToken,
	handleTokenInput,
}: {
	playerIndex: number
	tokens: Token[]
	updateTokenCount: (
		playerIndex: number,
		tokenIndex: number,
		change: number
	) => void
	addToken: (playerIndex: number) => void
	newToken: string
	handleTokenInput: (playerIndex: number, value: string) => void
}) => (
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
				value={newToken}
				onChange={(e) => handleTokenInput(playerIndex, e.target.value)}
				onKeyDown={(e) => e.key === 'Enter' && addToken(playerIndex)}
			/>
			<Button onClick={() => addToken(playerIndex)}>Add Token</Button>
		</div>
	</div>
)

export default TokenControl
