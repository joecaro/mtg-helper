'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import Image from 'next/image'
import { Input } from './input'

export function Combobox({
	options,
	value,
	setValue,
}: {
	options: { label: string; value: string; icon?: string; number?: string }[]
	value: string
	setValue: (value: string) => void
}) {
	const [open, setOpen] = React.useState(false)
	const [searchTerm, setSearchTerm] = React.useState('')

	const filteredOptions = React.useMemo(() => {
		return [
			{ label: 'All', value: '' },
			...options
				.filter(
					(option) =>
						option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
						option.value.toLowerCase().includes(searchTerm.toLowerCase())
				)
				.slice(0, 10),
		]
	}, [options, searchTerm])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between overflow-auto text-ellipsis bg-gray-500"
				>
					{value
						? options.find((option) => option.value === value)?.label
						: 'Select Set...'}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0 bg-slate-950 bg-opacity-50">
				<Input
					className="bg-gray-500"
					type="text"
					onChange={(e) => setSearchTerm(e.currentTarget.value)}
					value={searchTerm}
					placeholder="Search set..."
				/>
				{filteredOptions.map((option) => (
					<Button
						key={option.value}
						onClick={() => {
							setValue(option.value)
							setOpen(false)
						}}
						className="w-full justify-between"
					>
						{option.icon && (
							<Image
								alt="Set icon"
								src={option.icon}
								width={24}
								height={24}
								className="rounded-md bg-slate-50 bg-opacity-50 w-6 h-6"
							/>
						)}
						<span className="max-w-32 overflow-hidden">{option.label}</span>
						{value === option.value && <Check className="h-4 w-4" />}
					</Button>
				))}
			</PopoverContent>
		</Popover>
	)
}
