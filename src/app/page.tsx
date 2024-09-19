import { MtgDictionary } from "@/components/mtg-dictionary";
import { OpenaiChat } from "@/components/openai-chat";
import Image from "next/image";

import backgroundImg from "./background.webp";
import ClientApp from "./(client)";

export default function Home() {
    return (
        <div className='flex justify-center items-center w-screen h-screen'>
            <Image
                src={backgroundImg}
                alt='Magic: The Gathering'
                placeholder='blur'
                quality={100}
                fill
                sizes='100vw'
                className='object-cover -z-10'
            />
            <div className='p-4 m-auto container mx-auto max-w-7xl backdrop-blur-sm bg-slate-950 bg-opacity-50'>
                <h1 className='text-3xl font-bold mb-6 text-center text-slate-50'>
                    Magic: The Gathering
                </h1>
                <div className='flex flex-col gap-10 md:flex-row'>
                    <MtgDictionary />
                    <ClientApp>
                        <OpenaiChat />
                    </ClientApp>
                </div>
            </div>
        </div>
    );
}
