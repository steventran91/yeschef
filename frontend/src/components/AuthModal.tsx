"use client";

import {useState} from "react";
import {login, register, setToken} from "@/lib/api";

type Mode = "choice" | "login" | "register"

export default function AuthModal({onSuccess} : {onSuccess: () => void}) {
    const [mode, setMode] = useState<Mode>("choice");
    const [error, setError] = useState<string | null>(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e: React.SubmitEvent) {
        e.preventDefault();
        setError(null);
        try {
            const data = await login(email, password);
            setToken(data.access_token);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        }
    }

    async function handleRegister(e: React.SubmitEvent) {
        e.preventDefault();
        setError(null);
        try {
            const data = await register({first_name: firstName, last_name: lastName, email, password});
            setToken(data.access_token);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message: "Register failed");
        }
    }

    const inputClass = "w-full rounded-md border border-[#7C9074]/40 bg-white/60 px-3 py-2 text-sm text-[#4B5A44] placeholder:text-[#7C9074]/60 focus:outline-none focus:ring-2 focus:ring-[#7C9074]/50";
    const primaryButtonClass = "w-full rounded-md border border-[#7C9074] px-4 py-2 text-sm font-medium text-[#7C9074] transition hover:bg-[#7C9074] hover:text-white";
    const backButtonClass = "w-full text-center text-xs text-[#7C9074]/70 hover:text-[#7C9074]";


    return (
        <div className="w-72 rounded-2xl border border-[#7C9074]/20 bg-[#FBF8F2] p-6 shadow-xl">
            {mode === "choice" && (
                <div className="space-y-3">
                    <button onClick={() => setMode("register")} className={primaryButtonClass}>
                        Register
                    </button>
                    <button onClick={() => setMode("login")} className={primaryButtonClass}>
                        Login
                    </button>
                </div>
            )}

            {mode === "login" && (
                <form onSubmit={handleLogin} className="space-y-3">
                    {error && <p className="text-xs text-red-600">{error}</p>}
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass}/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}className={inputClass}/>
                    <button type="submit" className={primaryButtonClass}>Login</button>
                    <button type="button" onClick={() => setMode("choice")} className={backButtonClass}>Back</button>
                </form>
            )}

            {mode === "register" && (
                <form onSubmit={handleRegister} className="space-y-3">
                    {error && <p className="text-xs text-red-600">{error}</p>}
                    <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass}/>
                    <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass}/>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass}/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass}/>
                    <button type="submit" className={primaryButtonClass}>Register</button>
                    <button type="button" onClick={() => setMode("choice")} className={backButtonClass}>Back</button>
                </form>
            )}

        </div>
    )
}