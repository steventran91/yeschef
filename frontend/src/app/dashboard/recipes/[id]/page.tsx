"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRecipe } from "@/lib/api";

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
}

export default function RecipeDetailPage() {
    const params = useParams();
    const id = params.id as string; 

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getRecipe(id)
          .then((data) => setRecipe(data))
          .catch((err) => setError(err instanceof Error ? err.message: "Failed to fetch recipe"))
          .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p className="text-[#7C9074]">Loading...</p>
    if (error) return <p className="text-red-600">{error}</p>
    if (!recipe) return null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#7C9074]">{recipe.title}</h1>
                {recipe.description && <p className="text-[#7C9074]/70">{recipe.description}</p>}
                <p className="text-sm text-[#7C9074]">
                    Servings: {recipe.servings ?? 0} · Prep time: {recipe.prep_time_minutes ?? 0} · Cook time: {recipe.cook_time_minutes ?? 0}
                </p>
            </div>

            <div>
                <h2 className="font-medium text-[#7C9074]">Ingredients</h2>
                <ul className="mt-2 space-y-1">
                    {recipe.ingredients.map((ing) => (
                        <li key={ing.id} className="text-sm text-[#4B5A44]">
                            {ing.original_text}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2 className="font-medium text-[#7C9074]">Instructions</h2>
                <ol className="mt-2 space-y-2">
                    {recipe.instructions.map((instr) => (
                        <li key={instr.id} className="text-sm text-[#4B5A44]">
                            <span className="font-medium">{instr.step_number}.</span> {instr.text}
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    )
}
