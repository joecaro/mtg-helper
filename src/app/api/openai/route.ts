import OpenAI from "openai";
import { NextResponse } from "next/server";
import { systemMessage } from "./systemMessage";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: systemMessage,
                },
                ...messages.map(
                    (message: { role: string; content: string }) => ({
                        role: message.role,
                        content: message.content,
                    })
                ),
            ],
        });

        return NextResponse.json({
            message: completion.choices[0].message.content,
            completion: completion,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error with OpenAI API request: ${error.message}`);
            return NextResponse.json(
                {
                    error:
                        "An error occurred during your request. " +
                        error.message,
                },
                { status: 500 }
            );
        } else if (error && typeof error === "object" && "message" in error) {
            console.error(`Error with OpenAI API request: ${error.message}`);
            return NextResponse.json(
                { error: "An error occurred during your request." },
                { status: 500 }
            );
        } else {
            console.error(`Error with OpenAI API request: ${error}`);
            return NextResponse.json(
                { error: "An error occurred during your request." },
                { status: 500 }
            );
        }
    }
}
