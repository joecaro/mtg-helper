import { useCallback, useState } from "react";
import { CardData } from "./useCardSelection";

export type Message = {
    role: "user" | "assistant";
    content: string;
    type: "text" | "image";
};

// markdown message
const firstMessage: Message = {
    role: "assistant",
    content: `**Welcome,**

I am **Arcanis**, your Magic: The Gathering companion!

Ask me anything about Magic: The Gathering, whether it’s about **cards, sets, rules, or strategies**. I will do my best to provide you with the information you need.

*Click a card slot below if you'd like to ask about a specific card or group of cards.*
`,
    type: "text",
};

export function useAiChat(selectedCards: (null | CardData)[]) {
    const [messages, setMessages] = useState<Message[]>([firstMessage]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            console.log(input);

            e.preventDefault();
            if (!input.trim()) return;

            const newMessage: Message = {
                role: "user",
                content: input,
                type: "text",
            };
            setMessages(prev => [...prev, newMessage]);
            setInput("");
            setIsLoading(true);

            try {
                const response = await fetch("/api/openai", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messages: [
                            ...messages
                                .filter(m => m.type === "image")
                                .map(m => ({
                                    role: m.role,
                                    content: m.content,
                                })),
                            {
                                role: newMessage.role,
                                content: `User Provided Cards: ${JSON.stringify(
                                    selectedCards
                                )} User Message: ${newMessage.content}`,
                            },
                        ],
                    }),
                });

                if (!response.ok) throw new Error("Failed to get response");

                const data = await response.json();
                setMessages(prev => [
                    ...prev,
                    { role: "assistant", content: data.message, type: "text" },
                ]);
            } catch (error) {
                console.error("Error:", error);
                setMessages(prev => [
                    ...prev,
                    {
                        role: "assistant",
                        content:
                            "Sorry, there was an error processing your request.",
                        type: "text",
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        },
        [selectedCards, input, messages]
    );

    const handleImageGeneration = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/openai-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: input }),
            });

            if (!response.ok) throw new Error("Failed to generate image");

            const data = await response.json();
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: data.imageUrl,
                    type: "image",
                },
            ]);
        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, there was an error generating the image.",
                    type: "text",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        input,
        isLoading,
        setInput,
        handleSubmit,
        handleImageGeneration,
    };
}
