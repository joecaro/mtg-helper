import Image from "next/image";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { CardData } from "@/hooks/useCardSelection";
import { Dispatch } from "react";
import { UseQueryResult } from "@tanstack/react-query";

type CardProps = {
    selectedCards: (null | CardData)[];
    isSearchModalOpen: boolean;
    activeSlot: number | null;
    setIsSearchModalOpen: Dispatch<boolean>;
    handleSlotClick: (slotIndex: number) => void;
    handleClearSlot: (slotIndex: number) => void;
    cardSearchTerm: string;
    setCardSearchTerm: (value: string) => void;
    handleCardSearch: (e: React.FormEvent) => Promise<void>;
    query: UseQueryResult<CardData[], Error>;
    selectCard: (card: CardData) => void;
};

export default function Cards({
    selectedCards,
    isSearchModalOpen,
    activeSlot,
    setIsSearchModalOpen,
    handleSlotClick,
    handleClearSlot,
    cardSearchTerm,
    setCardSearchTerm,
    handleCardSearch,
    query,
    selectCard,
}: CardProps) {
    return (
        <div className='mt-4 grid grid-cols-7 gap-2'>
            {selectedCards.map((card, index) => (
                <Dialog
                    key={index}
                    open={isSearchModalOpen && activeSlot === index}
                    onOpenChange={setIsSearchModalOpen}
                >
                    <DialogTrigger asChild>
                        <Button
                            variant='outline'
                            className='h-[81px] w-[58px] p-0 relative rounded-none bg-slate-950 bg-opacity-70 hover:bg-slate-700'
                            onClick={() => handleSlotClick(index)}
                        >
                            {card?.imageUrl ? (
                                <Image
                                    alt='Card image'
                                    src={card.imageUrl}
                                    width={58}
                                    height={81}
                                    className='object-cover'
                                />
                            ) : null}
                            <span
                                onClick={() => handleClearSlot(index)}
                                className={`absolute top-0 right-0 p-1 rounded-full text-white text-xs 
                                         bg-red-600
                                    ${card ? "visible" : "invisible"}`}
                            >
                                {card ? "X" : "+"}
                            </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[425px]'>
                        <DialogHeader>
                            <DialogTitle>Search for a Card</DialogTitle>
                        </DialogHeader>
                        <div className='grid gap-4 py-4'>
                            <form
                                onSubmit={handleCardSearch}
                                className='flex items-center gap-2'
                            >
                                <Input
                                    type='text'
                                    placeholder='Card name'
                                    value={cardSearchTerm}
                                    onChange={e =>
                                        setCardSearchTerm(e.target.value)
                                    }
                                />
                                <Button
                                    type='submit'
                                    disabled={query.isLoading}
                                >
                                    Search
                                </Button>
                            </form>
                            <ScrollArea className='h-[300px]'>
                                {query.error ? (
                                    <p>{query.error.message}</p>
                                ) : (
                                    query.data?.map(card => (
                                        <Button
                                            key={card.id}
                                            variant='ghost'
                                            className='w-full h-fit gap-5 grid grid-cols-2'
                                            onClick={() => selectCard(card)}
                                        >
                                            <div className='w-[58px] h-[81px] bg-slate-400 '>
                                                {card.imageUrl ? (
                                                    <Image
                                                        alt='Card image'
                                                        src={card.imageUrl}
                                                        width={58}
                                                        height={81}
                                                        className='object-cover'
                                                    />
                                                ) : null}
                                            </div>
                                            <div className='flex flex-col gap-5 items-start'>
                                                <span>{card.name}</span>
                                                <span>{card.setName}</span>
                                            </div>
                                        </Button>
                                    ))
                                )}
                            </ScrollArea>
                        </div>
                    </DialogContent>
                </Dialog>
            ))}
        </div>
    );
}
