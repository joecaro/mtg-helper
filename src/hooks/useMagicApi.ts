import { useState } from "react";
import { SearchParams } from "@/app/api/cards/route";
import { useQuery } from "@tanstack/react-query";
import { CardData } from "./useCardSelection";

const useMagicApi = () => {
    const [params, setParams] = useState<SearchParams>({});

    const queryFn = async (params: SearchParams) => {
        const response = await fetch(
            `/api/cards?${new URLSearchParams(
                params as Record<string, string>
            ).toString()}`
        );
        return ((await response.json()) || []) as CardData[];
    };

    const query = useQuery({
        queryKey: ["cards", params],
        queryFn: () => queryFn(params),
    });

    const fetchData = (params: SearchParams) => {
        setParams(params);
    };

    return { query, fetchData };
};

export default useMagicApi;
