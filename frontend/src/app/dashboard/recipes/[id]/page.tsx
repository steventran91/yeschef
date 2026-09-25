"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getRecipe, uploadRecipeImage } from "@/lib/api";

type Ingredient = {
    id: number,
    name: string;
    original_text: string;
    quantity: number | null;
    unit: string | null;
    preparation: string | null;
    section: string | null;
    is_optional: boolean;
}

type Instruction = {
    id: number;
    step_number: number;
    text: string;
}

type Recipe = {
    id: number;
    title: string;
    description: string | null;
    servings: number | null;
    prep_time_minutes: number | null;
    cook_time_minutes: number | null;
    cuisine: string[];
    tags: string[];
    ingredients: Ingredient[];
    instructions: Instruction[];
    image_url: string | null;
}

export default function RecipeDetailPage() {
    const params = useParams();
    const id = params.id as string; 

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [checkedIds, setCheckedIds] = useState<number[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function toggleIngredient(id: number) {
        setCheckedIds((prev) =>
            prev.includes(id) ? prev.filter((existingId) => existingId !== id) : [...prev, id]
        );
    }

    useEffect(() => {
        getRecipe(id)
          .then((data) => setRecipe(data))
          .catch((err) => setError(err instanceof Error ? err.message: "Failed to fetch recipe"))
          .finally(() => setLoading(false));
    }, [id]);

    async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !recipe) return;

        setUploading(true);
        try {
            const updated = await uploadRecipeImage(recipe.id, file);
            setRecipe(updated);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload image");
        } finally {
            setUploading(false);
        }
    }

    if (loading) return <p className="text-[#7C9074]">Loading...</p>
    if (error) return <p className="text-red-600">{error}</p>
    if (!recipe) return null;

    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:divide-x md:divide-[#7C9074]/20">
            <div>
                <h2 className="text-center text-2xl font-bold text-[#7C9074]">Ingredients</h2>
                <p className="mt-1 text-center text-sm text-[#7C9074]">
                    Servings: {recipe.servings ?? 0} · Prep time: {recipe.prep_time_minutes ?? 0} · Cook time: {recipe.cook_time_minutes ?? 0}
                </p>
                <ul className="mt-3 space-y-1">
                    {recipe.ingredients.map((ing, index) => {
                        const previousSection = index > 0 ? recipe.ingredients[index - 1].section : null;
                        const showSectionHeader = ing.section && ing.section !== previousSection;

                        return (
                            <li key={ing.id}>
                                {showSectionHeader && (
                                    <p className="mt-3 mb-1 font-semibold text-[#7C9074]">{ing.section}</p>
                                )}
                                <label className="flex items-center gap-2 text-sm text-[#4B5A44]">
                                    <input
                                        type="checkbox"
                                        checked={checkedIds.includes(ing.id)}
                                        onChange={() => toggleIngredient(ing.id)}
                                        className="h-4 w-4 appearance-none rounded-full border border-[#7C9074] checked:bg-[#7C9074]"
                                    />
                                    <span className={checkedIds.includes(ing.id) ? "text-[#7C9074]/40 line-through" : ""}>
                                        {ing.original_text}
                                    </span>
                                </label>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="pr-6">
                <h2 className="text-center text-2xl font-bold text-[#7C9074]">Instructions</h2>
                <ol className="mt-3 space-y-2">
                    {recipe.instructions.map((instr) => (
                        <li key={instr.id} className="text-sm text-[#4B5A44]">
                            <span className="font-medium">{instr.step_number}.</span> {instr.text}
                        </li>
                    ))}
                </ol>
            </div>

            <div className="text-center">
                <h1 className="text-2xl font-bold text-[#7C9074]">{recipe.title}</h1>

                {recipe.image_url ? (
                    <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${recipe.image_url}`}
                        alt={recipe.title}
                        className="mx-auto mt-3 aspect-square w-4/5 rounded-lg object-cover"
                    />
                ) : (
                    <div className="mx-auto mt-3 flex aspect-square w-4/5 items-center justify-center rounded-lg border border-dashed border-[#7C9074]/40 text-sm text-[#7C9074]/60">
                        No image yet
                    </div>
                )}
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="mt-2 rounded-md border border-[#7C9074] px-3 py-1 text-sm text-[#7C9074] hover:bg-[#7C9074] hover:text-white disabled:opacity-50"
                >
                    {uploading ? "Uploading..." : recipe.image_url ? "Change Photo" : "Upload Photo"}
                </button>

                {recipe.description && (
                    <p className="mt-6 text-sm text-[#7C9074]/70">{recipe.description}</p>
                )}
            </div>
        </div>
    )
}
