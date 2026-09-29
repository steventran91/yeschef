"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createRecipe, updateRecipe } from "@/lib/api";


type RecipeCreateFormProps = {
    initialData?: {
        title?: string;
        description?: string;
        servings?: number;
        prep_time_minutes?: number;
        cook_time_minutes?: number;
        cuisine?: string[];
        tags?: string[];
        ingredients?: {name: string; original_text: string; quantity?: number; unit?: string; preparation?: string; section?: string; is_optional?: boolean}[];
        instructions?: {text: string; section?: string;}[];
    };
    recipeId?: number;
}

function RecipeCreateForm({initialData, recipeId} : RecipeCreateFormProps) {
    const router = useRouter();

    const [title, setTitle] = useState(initialData?.title ?? "");
    const [description, setDescription] = useState(initialData?.description ?? "");
    const [servings, setServings] = useState(initialData?.servings === undefined ? "" : String(initialData.servings));
    const [prepTime, setPrepTime] = useState(initialData?.prep_time_minutes === undefined ? "" : String(initialData.prep_time_minutes));
    const [cookTime, setCookTime] = useState(initialData?.cook_time_minutes === undefined ? "" : String(initialData.cook_time_minutes));
    const [cuisine, setCuisine] = useState<string[]>(initialData?.cuisine ?? []);
    const [cuisineInput, setCuisineInput] = useState("");
    const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
    const [tagsInput, setTagsInput] = useState("");
    const [ingredients, setIngredients] = useState<{
        name: string;
        original_text: string;
        quantity?: string;
        unit?: string;
        preparation?: string;
        section?: string;
        is_optional?: boolean;
    }[]>(initialData?.ingredients?.map((ing) => ({
        ...ing,
        quantity: ing.quantity === undefined ? "" : String(ing.quantity),
    }))?? []);

    const [instructions, setInstructions] = useState<{
        text: string;
        section?: string;
    }[]>(initialData?.instructions ?? []);

    const [error, setError] = useState<string | null>(null);

    function updateIngredient(index: number, field: string, value: string | number | boolean) {
        const updated = [...ingredients];
        updated[index] = {...updated[index], [field]: value};
        setIngredients(updated);
    }

    function updateInstruction(index: number, field: string, value: string) {
        const updated = [...instructions];
        updated[index] = {...updated[index], [field]: value};
        setInstructions(updated);
    }

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()
        const servingsValue = servings === "" ? undefined : Number(servings);
        const prepTimeValue = prepTime === "" ? undefined : Number(prepTime);
        const cookTimeValue = cookTime === "" ? undefined : Number(cookTime);
        const ingredientQuantityValue = ingredients.map((ing) => ({
            ...ing, quantity: ing.quantity === undefined || ing.quantity === "" ? undefined : Number(ing.quantity),
        }))

        const payload = {
            title, 
            description,
            servings: servingsValue,
            prep_time_minutes: prepTimeValue,
            cook_time_minutes: cookTimeValue,
            cuisine,
            tags,
            ingredients: ingredientQuantityValue,
            instructions,
        };
        
        try {
            
            if (recipeId) {
                await updateRecipe(recipeId, payload);
                router.push(`/dashboard/recipes/${recipeId}`);
            } else {
                const created = await createRecipe(payload);
                router.push(`/dashboard/recipes/${created.id}`)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message: "Failed to save recipe.");
        }

    }

    const inputClass = "w-full rounded-md border border-[#7C9074]/40 bg-white px-3 py-2 text-sm text-[#4B5A44] placeholder:text-[#7C9074]/60 focus:outline-none focus:ring-2 focus:ring-[#7C9074]/50";
    const addButtonClass = "rounded-md border border-[#7C9074] px-3 py-1 text-sm text-[#7C9074] hover:bg-[#7C9074] hover:text-white";
    const chipClass = "inline-block rounded border border-[#7C9074]/40 px-2 py-0.5 text-xs text-[#7C9074]";
    const rowLabelClass = "text-sm text-[#4B5A44]";

    return (
        <div className="space-y-6 text-[#7C9074]">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-sm text-red-600">{error}</p>}

                <input className={inputClass} type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <input className={inputClass} type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                <div className="flex gap-3">
                    <input className={inputClass} type="number" placeholder="Servings" value={servings} onChange={(e) => setServings(e.target.value)}/>
                    <input className={inputClass} type="number" placeholder="Prep Time" value={prepTime} onChange={(e) => setPrepTime(e.target.value)}/>
                    <input className={inputClass} type="number" placeholder="Cook Time" value={cookTime} onChange={(e) => setCookTime(e.target.value)}/>
                </div>

                <div>
                    <div className="flex gap-2">
                        <input className={inputClass} type="text" placeholder="Cuisine" value={cuisineInput} onChange={(e) => setCuisineInput(e.target.value)}/>
                        <button type="button" className={addButtonClass} onClick={() => { if (cuisineInput.trim() === "") return;
                            setCuisine([...cuisine, cuisineInput]);
                            setCuisineInput("");
                        }}>Add</button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                        {cuisine.map((c) => (
                            <span key={c} className={chipClass}>{c}</span>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex gap-2">
                        <input className={inputClass} type="text" placeholder="Tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}/>
                        <button type="button" className={addButtonClass} onClick={() => { if (tagsInput.trim() === "") return;
                            setTags([...tags, tagsInput]);
                            setTagsInput("");
                        }}>Add</button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                        {tags.map((t) => (
                            <span key={t} className={chipClass}>{t}</span>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-lg font-semibold">Ingredients</h2>
                    <button type="button" className={addButtonClass} onClick={() => {setIngredients([...ingredients, {name: "", original_text: "",  quantity: "", unit: "", preparation: "", section: "", is_optional: false }])}}>Add Ingredient</button>
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="space-y-2 rounded-md border border-[#7C9074]/20 p-3">
                            <input
                                className={inputClass}
                                type="text"
                                placeholder="Ingredient name"
                                value={ingredient.name}
                                onChange={(e) => updateIngredient(index, "name", e.target.value)}
                            />
                            <input
                                className={inputClass}
                                type="text"
                                placeholder="Original text (e.g. 2 tbsp soy sauce)"
                                value={ingredient.original_text}
                                onChange={(e) => updateIngredient(index, "original_text", e.target.value)}
                            />
                            <div className="flex gap-2">
                                <input
                                    className={inputClass}
                                    type="number"
                                    placeholder="Quantity"
                                    value={ingredient.quantity ?? ""}
                                    onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                                />
                                <input
                                    className={inputClass}
                                    type="text"
                                    placeholder="Unit"
                                    value={ingredient.unit ?? ""}
                                    onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                                />
                            </div>
                            <input
                                className={inputClass}
                                type="text"
                                placeholder="Preparation"
                                value={ingredient.preparation ?? ""}
                                onChange={(e) => updateIngredient(index, "preparation", e.target.value)}
                            />
                            <input
                                className={inputClass}
                                type="text"
                                placeholder="Section"
                                value={ingredient.section ?? ""}
                                onChange={(e) => updateIngredient(index, "section", e.target.value)}
                            />
                            <label className={`flex items-center gap-2 ${rowLabelClass}`}>
                                <input
                                    type="checkbox"
                                    checked={ingredient.is_optional}
                                    onChange={(e) => updateIngredient(index, "is_optional", e.target.checked)}
                                />
                                Optional
                            </label>
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    <h2 className="text-lg font-semibold">Instructions</h2>
                    <button type="button" className={addButtonClass} onClick={() => setInstructions([...instructions, {text: "", section: ""}])}>Add Instructions</button>
                    {instructions.map((instruction, index) => (
                        <div key={index} className="space-y-2 rounded-md border border-[#7C9074]/20 p-3">
                            <input
                                className={inputClass}
                                type="text"
                                placeholder={`Step ${index + 1}`}
                                value={instruction.text}
                                onChange={(e) => updateInstruction(index, "text", e.target.value)}
                            />
                            <input
                                className={inputClass}
                                type="text"
                                placeholder="Section (optional)"
                                value={instruction.section ?? ""}
                                onChange={(e) => updateInstruction(index, "section", e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                <button type="submit" className="w-full rounded-md border border-[#7C9074] px-4 py-2 text-sm font-medium text-[#7C9074] hover:bg-[#7C9074] hover:text-white">Create</button>
            </form>
        </div>
    )
}

export default RecipeCreateForm;