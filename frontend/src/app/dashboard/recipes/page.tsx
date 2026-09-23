"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecipes } from "@/lib/api";

type Recipe = {
    id: number;
    title: string;
    cuisine: string[];
    tags: string[];
    image_url: string | null;
};

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getRecipes()
          .then((data) => setRecipes(data))
          .catch((err) => setError(err instanceof Error ? err.message : "Failed to load recipes"))
          .finally(() => setLoading(false));
    }, []);

    const filteredRecipes = recipes.filter((recipe) => 
        recipe.title.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <p className="text-[#7C9074]">Loading recipes...</p>
    if (error) return <p className="text-red-600">{error}</p>

    return (
        <div className="space-y-4">
            <input
                type="text"
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-sm rounded-md border border-[#7C9074]/40 bg-white/60 px-2 text-sm text-[#4B5A44] placeholder:text-[#7C9074]/60 focus:outline-none focus:ring-2 focus:ring-[#7C9074]/50"
                />
            <Link href="/dashboard/recipes/new" className="text-[#7C9074] font-medium hover:underline ml-2">+ New Recipe</Link>
    {filteredRecipes.length === 0 ? (
        <p className="text-[#7C9074]/70">No recipes found.</p>
    ) : (
        <ul className="space-y-2">
            {filteredRecipes.map((recipe) => (
                <li key={recipe.id}>
                    <Link
                        href={`/dashboard/recipes/${recipe.id}`}
                        className="flex min-h-[128px] items-start gap-4 rounded-lg border border-[#7C9074]/20 bg-white/60 p-4 hover:border-[#7C9074]"
                    >
                        {recipe.image_url ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}${recipe.image_url}`}
                                alt={recipe.title}
                                className="h-20 w-20 flex-shrink-0 rounded-md object-cover"
                            />
                        ) : (
                            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md border border-dashed border-[#7C9074]/40 text-xs text-[#7C9074]/50">
                                No image
                            </div>
                        )}

                        <div className="min-w-0 flex-1">
                            <p className="text-lg font-semibold text-[#7C9074]">{recipe.title}</p>

                            {recipe.cuisine.length > 0 && (
                                <div className="mt-2 flex flex-wrap items-center gap-1">
                                    <span className="text-xs font-medium text-[#7C9074]/70">Cuisine:</span>
                                    {recipe.cuisine.map((c) => (
                                        <span key={c} className="rounded border border-[#7C9074]/40 px-1 py-0.5 text-xs text-[#7C9074]">
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {recipe.tags.length > 0 && (
                                <div className="mt-1 flex flex-wrap items-center gap-1">
                                    <span className="text-xs font-medium text-[#7C9074]/70">Tags:</span>
                                    {recipe.tags.map((t) => (
                                        <span key={t} className="rounded border border-[#7C9074]/40 px-1 py-0.5 text-xs text-[#7C9074]">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    )}
        </div>
    )
}