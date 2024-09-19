import Image from "next/image";
import { FixedSizeList as List } from "react-window";

import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { CardData } from "@/hooks/useCardSelection";
import { Dispatch, useState } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { useCardSets } from "@/hooks/useCardSets";
import useCards from "@/hooks/useCards";
import { Combobox } from "./ui/combobox";

type CardProps = {
    selectedCards: (null | CardData)[];
    isSearchModalOpen: boolean;
    activeSlot: number | null;
    setIsSearchModalOpen: Dispatch<boolean>;
    handleSlotClick: (slotIndex: number) => void;
    handleClearSlot: (slotIndex: number) => void;
    selectCard: (card: CardData) => void;
};

export default function Cards({
    selectedCards,
    isSearchModalOpen,
    activeSlot,
    setIsSearchModalOpen,
    handleSlotClick,
    handleClearSlot,
    selectCard,
}: CardProps) {
    const [selectedSetSearch, setSelectedSetSearch] = useState<
        string | undefined
    >("");
    const [selectedSet, setSelectedSet] = useState<string | undefined>(
        undefined
    );
    const [searchTerm, setSearchTerm] = useState<string>("");

    const setsQuery = useCardSets();
    const { query: cardsQuery, fetchData } = useCards();

    const handleSetSet = (set: string) => {
        setSelectedSet(set);
        setSelectedSetSearch(set);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchData({ set: selectedSet, name: searchTerm });
    };
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
                            className='h-[81px] w-[58px] p-0 relative bg-slate-950 bg-opacity-70 hover:bg-slate-700 rounded'
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
                                className={`absolute -top-2 -right-2 py-1 px-2 rounded-full text-white text-xs 
hover:bg-red-400 bg-red-600
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
                                onSubmit={handleSearchSubmit}
                                className='flex items-center gap-2'
                            >
                                <Input
                                    type='search'
                                    placeholder='Search for a card'
                                    value={searchTerm}
                                    onChange={e =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                                <Combobox
                                    options={
                                        setsQuery.data?.map(set => ({
                                            label: set.name,
                                            value: set.code,
                                            icon: set.icon_svg_uri,
                                            number: set.card_count,
                                        })) || []
                                    }
                                    value={selectedSetSearch || ""}
                                    setValue={handleSetSet}
                                />
                                <Button
                                    type='submit'
                                    disabled={cardsQuery.isLoading}
                                >
                                    Search
                                </Button>
                            </form>
                            <ScrollArea className='h-[300px]'>
                                {cardsQuery.error ? (
                                    <p>{cardsQuery.error.message}</p>
                                ) : (
                                    cardsQuery.data?.map(card => (
                                        <Button
                                            key={card.id}
                                            variant='ghost'
                                            className='w-full h-fit gap-5 grid grid-cols-2'
                                            onClick={() => selectCard(card)}
                                        >
                                            <div className='w-[58px] h-[81px] bg-slate-400 rounded '>
                                                {card.imageUrl ? (
                                                    <Image
                                                        alt='Card image'
                                                        src={card.imageUrl}
                                                        width={58}
                                                        height={81}
                                                        className='object-cover rounded'
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
