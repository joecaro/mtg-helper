import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
	try {
		const { prompt } = await req.json()
		const image = await openai.images.generate({
			prompt: prompt,
			model: 'dall-e-3',
		})

		return NextResponse.json({
			imageUrl: image.data[0].url,
			response: image,
		})
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(`Error with OpenAI API request: ${error.message}`)
			return NextResponse.json(
				{ error: 'An error occurred during your request.' },
				{ status: 500 }
			)
		} else if (error && typeof error === 'object' && 'message' in error) {
			console.error(`Error with OpenAI API request: ${error.message}`)
			return NextResponse.json(
				{ error: 'An error occurred during your request.' },
				{ status: 500 }
			)
		} else {
			console.error(`Error with OpenAI API request: ${error}`)
			return NextResponse.json(
				{ error: 'An error occurred during your request.' },
				{ status: 500 }
			)
		}
	}
}
