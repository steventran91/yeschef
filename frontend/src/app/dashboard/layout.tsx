"use client";

import {useEffect, useState} from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {getMe, clearToken} from '@/lib/api';

type User = {first_name: string};

const TABS = [
    {href: "/dashboard/chat", label: "Chat"},
    {href: "/dashboard/recipes", label: "Recipes"},
];

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        getMe()
          .then((me) => setUser(me))
          .catch(() => {
            clearToken();
            router.push("/");
          })
          .finally(() => setChecked(true));
    }, [router]);

    function handleLogout() {
        clearToken();
        router.push("/");
    }

    if (!checked || !user) return null;

    return (
        <div className="flex min-h-screen flex-col bg-[#F1EAE0]">
            <header className="flex items-center justify-between px-6 py-4">
                <span className="text-[#7C9074]">Welcome, {user.first_name}</span>
                <h1 className="font-script text-3xl text-[#7C9074]">yeschef</h1>
                <button onClick={handleLogout} className="text-sm text-[#7C9074]/70 hover:text-[#7C9074]">
                Logout
                </button>
            </header>

            <nav className="flex gap-1 px-6">
                {TABS.map((tab) => {
                    const isActive = pathname.startsWith(tab.href);
                    return (
                        <Link key={tab.href} href={tab.href} className={`rounded-t-lg px-4 py-2 text-sm ${
                            isActive ? "bg-[#FBF8F2] font-medium text-[#7C9074]" : "bg-transparent text-[#7C9074]/60 hover:text-[#7C9074]"
                        }`}
                    >
                        {tab.label}    
                        </Link>
                    )
                })}
            </nav>
            <main className="flex-1 bg-[#FBF8F2] p-6">{children}</main>
        </div>
    )
}