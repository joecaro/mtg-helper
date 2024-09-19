import { MtgDictionary } from "@/components/mtg-dictionary";
import Image from "next/image";

import backgroundImg from "./background.webp";
import ClientApp from "./(client)";
import { cookies } from "next/headers";
import { Suspense } from "react";
import PasswordForm from "@/components/password-form";
import { OpenaiChat } from "@/components/openai-chat";

export default function Home() {
    const cookieStore = cookies();
    const password = cookieStore.get("password");
    const correctPassword = process.env.SUPER_SECRET_PASSWORD;

    console.log(password);

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
            <div className='p-4 m-auto container mx-auto max-w-7xl backdrop-blur-sm bg-slate-950 bg-opacity-50 rounded-lg'>
                <h1 className='text-3xl font-bold mb-6 text-center text-slate-50'>
                    Magic: The Gathering
                </h1>
                <div className='flex flex-col gap-10 md:flex-row'>
                    <MtgDictionary />
                    <ClientApp>
                        {password?.value === correctPassword ? (
                            <Suspense
                                fallback={
                                    <div>Loading protected content...</div>
                                }
                            >
                                <OpenaiChat />
                            </Suspense>
                        ) : (
                            <PasswordForm />
                        )}
                    </ClientApp>
                </div>
            </div>
        </div>
    );
}
