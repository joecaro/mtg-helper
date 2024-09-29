'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { mtgGlossary } from '@/lib/mtg-glossary'

export function MtgDictionary() {
	const [searchTerm, setSearchTerm] = useState('')

	return (
		<div className="container mx-auto p-4 border-2 rounded-md flex-1 basis-1/2">
			<h2 className="text-3xl font-bold mb-4">MTG Dictionary</h2>
			<Input
				type="search"
				placeholder="Search for a term..."
				className="mb-6 bg-gray-500 placeholder:text-slate-200"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
			/>
			<ScrollArea className="h-[650px] rounded-md ">
				<div className="space-y-4">
					{mtgGlossary.map((section) => (
						<div key={section.title} className="space-y-4">
							<p className="text-xl">{section.title}</p>
							{section.terms.map((term) =>
								term.term.toLowerCase().includes(searchTerm) ||
								term.definition.toLowerCase().includes(searchTerm) ? (
									<Card
										key={
											'glossary-term-' +
											term.term.toLowerCase().replace(' ', '-')
										}
										className="text-foreground bg-gray-500 text-neutral-50 border-none"
									>
										<div className="p-4 flex flex-col gap-4">
											<CardHeader>
												<CardTitle>{term.term}</CardTitle>
											</CardHeader>
											<CardContent>{term.definition}</CardContent>
										</div>
									</Card>
								) : null
							)}
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	)
}
