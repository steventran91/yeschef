"use client"
import { chatWithAI } from "@/lib/api";
import { useState } from "react"

export default function ChatPage() {
    const [messages, setMessages] = useState<{role: "user" | "assistant", content: string, recipes?: {id: number, title: string}[]}[]>([]);
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
            const response = await chatWithAI(updatedMessages);
            setMessages([...updatedMessages, {role: "assistant" as const, content: response.reply, recipes: response.recipes ?? undefined}])
        } catch (err) {
            setMessages([...updatedMessages, {role: "assistant" as const, content: "Unable to process messages right now. Please try again."}])
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={msg.role === "user"
                            ? "ml-auto max-w-[75%] bg-black text-white rounded-lg px-3 py-2"
                            : "mr-auto max-w-[75%] bg-gray-100 text-black rounded-lg px-3 py-2"
                        }>
                            {msg.content}
                        </div>
                    ))}
                </div>

            {loading && <p className="text-sm text-gray-400 italic">Thinking...</p>}

            <div className="flex gap-2">
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2" />
                <button 
                    type="button"
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-black text-white rounded-lg px-4 py-2 disabled:opacity-50">
                    Send
                </button>
            </div>
        </div>
    )
}