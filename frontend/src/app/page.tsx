"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (getToken()) {
      router.push("/dashboard/recipes");
    } else {
      setChecked(true);
    }
  }, [router]);

  function handleAuthSuccess() {
    router.push("/dashboard/recipes");
  }

  if (!checked) return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F1EAE0] p-4">
      <div className="relative">
        <h1 className="font-script absolute bottom-full mb-6 w-full select-none whitespace-nowrap text-center text-6xl text-[#7C9074] sm:text-8xl">
          yeschef
        </h1>
        <AuthModal onSuccess={handleAuthSuccess} />
      </div>
    </main>
  );
}
