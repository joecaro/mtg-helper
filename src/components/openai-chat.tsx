"use client";

import Image from "next/image";
import { Loader2, Send, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { useAiChat } from "@/hooks/useAiChat";
import Cards from "./cards";
import useCardSelection from "@/hooks/useCardSelection";
import Chat from "./chat";

export function OpenaiChat() {
    const {
        selectedCards,
        isSearchModalOpen,
        activeSlot,
        setIsSearchModalOpen,
        selectCard,
        handleSlotClick,
        handleClearSlot,
    } = useCardSelection();

    const {
        messages,
        input,
        isLoading,
        setInput,
        handleSubmit,
        handleImageGeneration,
    } = useAiChat(selectedCards);

    return (
        <div className='container mx-auto p-4 border-2 rounded-md flex-1 basis-1/2'>
            <ReactQueryDevtools initialIsOpen={false} />
            <h2 className='text-2xl font-bold mb-4'>
                Arcanis the Omnipotent Chat
            </h2>
            <Card className='mb-4'>
                <CardContent>
                    <ScrollArea className='h-[400px] p-4 bg-slate-950 bg-opacity-70 rounded-md'>
                        <Chat messages={messages} />
                        {isLoading && (
                            <div className='flex items-center text-gray-500'>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Thinking...
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
            <form onSubmit={handleSubmit} className='flex gap-2 mb-4'>
                <Input
                    type='text'
                    value={input}
                    onChange={e => setInput(e.currentTarget.value)}
                    placeholder='Ask a question or describe an image...'
                    className='flex-grow bg-slate-950 bg-opacity-70'
                />
                <Button type='submit' disabled={isLoading}>
                    <Send className='mr-2 h-4 w-4' />
                    {isLoading ? "Thinking" : "Send"}
                </Button>
                <Button
                    type='button'
                    onClick={handleImageGeneration}
                    disabled={isLoading}
                >
                    <ImageIcon className='mr-2 h-4 w-4' />
                    Generate Image
                </Button>
            </form>
            <Cards
                selectedCards={selectedCards}
                isSearchModalOpen={isSearchModalOpen}
                activeSlot={activeSlot}
                setIsSearchModalOpen={setIsSearchModalOpen}
                handleSlotClick={handleSlotClick}
                handleClearSlot={handleClearSlot}
                selectCard={selectCard}
            />
        </div>
    );
}
