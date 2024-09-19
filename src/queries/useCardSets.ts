import { useQuery } from "@tanstack/react-query";
type CardSet = {
    object: string;
    id: string;
    code: string;
    name: string;
    uri: string;
    scryfall_uri: string;
    search_uri: string;
    released_at: string;
    set_type: string;
    card_count: string;
    digital: string;
    nonfoil_only: string;
    foil_only: string;
    icon_svg_uri: string;
};

export function useCardSets() {
    const fetchCardSets = async () => {
        const response = await fetch("https://api.scryfall.com/sets");
        const data = await response.json();
        return data.data;
    };

    return useQuery<CardSet[]>({
        queryKey: ["cardSets"],
        queryFn: fetchCardSets,
    });
}
