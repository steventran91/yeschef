"use client"
import { chatWithAI } from "@/lib/api";
import { useState } from "react"

export default function ChatPage() {
    const [messages, setMessages] = useState<{role: "user" | "assistant", content: string}[]>([]);
    const [input, setInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function handleSend() {
        if (input.trim() === "") return;
        const newMessage = {role: "user" as const, content: input};
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const reply = await chatWithAI(updatedMessages);
            setMessages([...updatedMessages, {role: "assistant" as const, content: reply}])
        } catch (err) {
            setMessages([...updatedMessages, {role: "assistant" as const, content: "Unable to process messages right now. Please try again."}])
        } finally {
            setLoading(false);
        }

    }

    return (
       <p>Chatbox coming soon...</p>
    )
}