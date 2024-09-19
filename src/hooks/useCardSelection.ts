import { useState } from "react";
import useMagicApi from "./useCards";

export interface CardData {
    id: string;
    name: string;
    imageUrl?: string;
    manaCost: string;
    cmc: number;
    colors: string[];
    colorIdentity: string[];
    type: string;
    types: string[];
    subtypes: string[];
    rarity: string;
    set: string;
    setName: string;
    text: string;
    artist: string;
    number: string;
    power: string;
    toughness: string;
    layout: string;
    multiverseid: string;
    variations: string[];
    foreignNames: {
        name: string;
        text: string;
        type: string;
        flavor: string;
        imageUrl: string;
    }[];
    printings: string[];
    originalText: string;
    originalType: string;
    legalities: {
        format: string;
        legality: string;
    }[];
}

export default function useCardSelection() {
    const [selectedCards, setSelectedCards] = useState<(null | CardData)[]>(
        Array(7).fill(null)
    );
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [cardSearchTerm, setCardSearchTerm] = useState("");
    const [activeSlot, setActiveSlot] = useState<number | null>(null);

    const selectCard = (card: CardData) => {
        if (activeSlot !== null) {
            const newSelectedCards = [...selectedCards];
            newSelectedCards[activeSlot] = card;
            setSelectedCards(newSelectedCards);
            setIsSearchModalOpen(false);
            setActiveSlot(null);
        }
    };

    const handleSlotClick = (slotIndex: number) => {
        setActiveSlot(slotIndex);
        setIsSearchModalOpen(true);
    };

    const handleClearSlot = (slotIndex: number) => {
        const newSelectedCards = [...selectedCards];
        newSelectedCards[slotIndex] = null;
        setSelectedCards(newSelectedCards);
    };

    const handleClearAll = () => {
        setSelectedCards(Array(7).fill(null));
    };

    return {
        selectedCards,
        isSearchModalOpen,
        cardSearchTerm,
        activeSlot,
        setIsSearchModalOpen,
        setCardSearchTerm,
        selectCard,
        handleSlotClick,
        handleClearSlot,
        handleClearAll,
    };
}
