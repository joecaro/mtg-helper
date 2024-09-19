import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	const { password } = await req.json()
	const correctPassword = process.env.SUPER_SECRET_PASSWORD

	if (password === correctPassword) {
		const response = NextResponse.json({ success: true })
		// Set a cookie that expires in 1 day
		response.cookies.set('password', password, { maxAge: 24 * 60 * 60 })
		return response
	}

	return NextResponse.json({ success: false }, { status: 401 })
}
