import { NextResponse } from 'next/server'
import { Set } from '../../../types/mtg'

const endpoint = 'https://api.magicthegathering.io/v1/sets'

export async function GET() {
	const response = await fetch(endpoint)
	const data = await response.json()

	const sets = data.sets as Set[]
	return NextResponse.json(sets)
}
