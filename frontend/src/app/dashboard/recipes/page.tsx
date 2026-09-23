"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getRecipes, getRecipe, uploadRecipeImage } from "@/lib/api";

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
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
    {filteredRecipes.length === 0 ? (
        <p className="text-[#7C9074]/70">No recipes found.</p>
    ) : (
        <ul className="space-y-2">
            {filteredRecipes.map((recipe) => (
                <li key={recipe.id}>
                    <Link
                        href={`/dashboard/recipes/${recipe.id}`}
                        className="block rounded-lg border border-[#7C9074]/20 bg-white/60 p-4 hover:border-[#7C9074]"
                    >
                        {recipe.image_url && (
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}${recipe.image_url}`}
                                alt={recipe.title}
                                className="h-16 w-16 rounded-md object-cover"
                            />
                        )}
                    <div>
                        <p className="font-medium text-[#7C9074]">{recipe.title}</p>
                        {(recipe.cuisine.length > 0 || recipe.tags.length > 0) && (
                            <p className="text-sm text-[#7C9074]">
                                {[...recipe.cuisine, ...recipe.tags].join(" · ")}
                            </p>
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