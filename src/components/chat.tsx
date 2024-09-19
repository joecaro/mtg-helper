import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { Message } from "@/hooks/useAiChat";

export default function Chat({ messages }: { messages: Message[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [expandedSections, setExpandedSections] = useState<Set<number>>(
        new Set()
    );

    const toggleSection = (index: number) => {
        const updatedSections = new Set(expandedSections);
        if (updatedSections.has(index)) {
            updatedSections.delete(index);
        } else {
            updatedSections.add(index);
        }
        setExpandedSections(updatedSections);
    };

    const [isUserAtBottom, setIsUserAtBottom] = useState(true);

    // Scroll to the bottom when a new message is added, but only if the user is at the bottom
    useEffect(() => {
        if (isUserAtBottom && containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    // Check if the user is at the bottom
    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } =
                containerRef.current;
            setIsUserAtBottom(scrollTop + clientHeight >= scrollHeight - 5);
        }
    };

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className='overflow-y-auto h-[400px] p-4 bg-slate-950 bg-opacity-70 rounded-md'
        >
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`mb-4 ${
                        message.role === "assistant"
                            ? "text-green-400"
                            : "text-slate-50"
                    }`}
                >
                    <strong>
                        {message.role === "assistant" ? "AI: " : "You: "}
                    </strong>
                    {message.type === "text" ? (
                        <ReactMarkdown
                            key={message.content}
                            rehypePlugins={[rehypeSlug]}
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ node, ...props }) => (
                                    <h1
                                        {...props}
                                        className='chat-heading'
                                        onClick={() => toggleSection(index)}
                                    />
                                ),
                                h2: ({ node, ...props }) => (
                                    <h2
                                        {...props}
                                        className='chat-heading'
                                        onClick={() => toggleSection(index)}
                                    />
                                ),
                                h3: ({ node, ...props }) => (
                                    <h3
                                        {...props}
                                        className='chat-heading'
                                        onClick={() => toggleSection(index)}
                                    />
                                ),
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    ) : (
                        <Image
                            alt='Generated image'
                            src={message.content}
                            width={300}
                            height={300}
                            className='object-cover rounded-md'
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
