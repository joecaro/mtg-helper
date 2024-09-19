// app/api/cards/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { Card } from "../../../types/mtg";
import { log } from "console";

const endpoint = "https://api.magicthegathering.io/v1/cards";

// types/mtg.ts
export interface SearchParams {
    name?: string;
    layout?: string;
    cmc?: number;
    colors?: string; // Will support comma and pipe-delimited values
    colorIdentity?: string; // Same here
    type?: string;
    supertypes?: string;
    types?: string;
    subtypes?: string;
    rarity?: string;
    set?: string;
    setName?: string;
    text?: string;
    flavor?: string;
    artist?: string;
    number?: string;
    power?: string;
    toughness?: string;
    loyalty?: number;
    language?: string;
    gameFormat?: string;
    legality?: string;
    page?: number;
    pageSize?: number;
    orderBy?: string;
    random?: boolean;
    contains?: string;
    id?: string;
    multiverseid?: string;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const params = {
        name: searchParams.get("name") || undefined,
        layout: searchParams.get("layout") || undefined,
        colors: searchParams.get("colors") || undefined,
        colorIdentity: searchParams.get("colorIdentity") || undefined,
        supertypes: searchParams.get("supertypes") || undefined,
        types: searchParams.get("types") || undefined,
        subtypes: searchParams.get("subtypes") || undefined,
        rarity: searchParams.get("rarity") || undefined,
        set: searchParams.get("set") || undefined,
        setName: searchParams.get("setName") || undefined,
        text: searchParams.get("text") || undefined,
        flavor: searchParams.get("flavor") || undefined,
        artist: searchParams.get("artist") || undefined,
        number: searchParams.get("number") || undefined,
        power: searchParams.get("power") || undefined,
        toughness: searchParams.get("toughness") || undefined,
        loyalty: searchParams.has("loyalty")
            ? Number(searchParams.get("loyalty"))
            : undefined,
        language: searchParams.get("language") || undefined,
        gameFormat: searchParams.get("gameFormat") || undefined,
        legality: searchParams.get("legality") || undefined,
        page: searchParams.has("page") ? Number(searchParams.get("page")) : 1,
        pageSize: searchParams.has("pageSize")
            ? Number(searchParams.get("pageSize"))
            : 100,
        orderBy: searchParams.get("orderBy") || undefined,
        random: searchParams.has("random")
            ? searchParams.get("random") === "true"
            : undefined, // Handle random as a Boolean
        contains: searchParams.get("contains") || undefined,
        id: searchParams.get("id") || undefined,
        multiverseid: searchParams.get("multiverseid") || undefined,
    };

    // Construct the query string for the external API
    const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join("&");

    const response = await fetch(`${endpoint}?${queryString}`);
    const data = await response.json();

    if (process.env.NODE_ENV === "development") {
        const formattedTime = new Date().toLocaleString();
        const logEntry = `${formattedTime}: request: ${endpoint}?${queryString}\nresponse: ${JSON.stringify(
            data,
            null,
            2
        )}\n\n`;
        fs.appendFileSync("log.txt", logEntry);
    }

    // Ensure the response is JSON-serializable
    const cards = (data.cards as Card[]) || [];

    return NextResponse.json(cards);
}
