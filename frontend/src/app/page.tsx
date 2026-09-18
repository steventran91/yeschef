"use client";

import {useEffect, useState} from "react";
import { getToken, getMe, clearToken } from "@/lib/api";
import AuthModal from "@/components/AuthModal";

type User = {first_name: string};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);

  async function loadUser() {
    if (!getToken()) {
      setChecked(true);
      return;
    }
    try {
      const me =  await getMe();
      setUser(me);
    } catch {
      clearToken();
    }
    setChecked(true);
  }

  function handleLogout() {
    clearToken();
    setUser(null);
  }

  useEffect(() => {
    loadUser();
  }, []);

  if (!checked) return null;

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F1EAE0] p-4">
        <div className="relative">
          <h1 className="font-script absolute bottom-full mb-6 w-full select-none whitespace-nowrap text-center text-6xl text-[#7C9074] sm:text-8xl">
            yeschef
          </h1>
          <AuthModal onSuccess={loadUser} />
        </div>
      </main>
    );
  }

  const backButtonClass = "w-full text-center text-xs text-[#7C9074]/70 hover:text-[#7C9074]";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F1EAE0] p-4">
      <h1 className="text-2xl font-bold text-[#7C9074]">Welcome, {user.first_name}</h1>
      <button onClick={handleLogout} className={backButtonClass}>Logout</button>
    </main>
  );
}