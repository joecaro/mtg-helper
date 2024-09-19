"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function PasswordForm() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch("/api/check-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            window.location.reload(); // Reload to fetch the protected content
        } else {
            setError("Incorrect password. Please try again.");
        }
    };

    return (
        <div className='container mx-auto p-4 border-2 rounded-md flex-1 basis-1/2'>
            <form
                className='flex flex-col bg-gray-500 p-5 border-2 rounded-md'
                onSubmit={handleSubmit}
            >
                <label>
                    Chat Password
                    <Input
                        className='placeholder:text-slate-200'
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder='Enter the password'
                    />
                </label>
                <Button className='m-4 bg-slate-700' type='submit'>
                    Submit
                </Button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
}
