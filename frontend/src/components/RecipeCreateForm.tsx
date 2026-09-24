"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createRecipe } from "@/lib/api";

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
        instructions?: {text: string}[];
    }
}

function RecipeCreateForm({initialData} : RecipeCreateFormProps) {
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
    }[]>(initialData?.instructions ?? []);
    
    const [error, setError] = useState<string | null>(null);

    function updateIngredient(index: number, field: string, value: string | number | boolean) {
        const updated = [...ingredients];
        updated[index] = {...updated[index], [field]: value};
        setIngredients(updated);
    }

    function updateInstruction(index: number, value: string) {
        const updated = [...instructions];
        updated[index] = {text: value};
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
            const created = await createRecipe(payload);
            router.push(`/dashboard/recipes/${created.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message: "Failed to create recipe");
        }

    }

    return (
        <div className="text-[#7C9074]">
            <form onSubmit={handleSubmit}>
                {error && <p>{error}</p>}
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                <input type="number" placeholder="Servings" value={servings} onChange={(e) => setServings(e.target.value)}/>
                <input type="number" placeholder="Prep Time" value={prepTime} onChange={(e) => setPrepTime(e.target.value)}/>
                <input type="number" placeholder="Cook Time" value={cookTime} onChange={(e) => setCookTime(e.target.value)}/>
                <input type="text" placeholder="Cuisine" value={cuisineInput} onChange={(e) => setCuisineInput(e.target.value)}/>
                <button type="button" onClick={() => { if (cuisineInput.trim() === "") return;
                    setCuisine([...cuisine, cuisineInput]);
                    setCuisineInput("");
                }}>Add</button>
                {cuisine.map((c) => (
                    <span key={c}>{c}</span>
                ))}
                <input type="text" placeholder="Tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}/>
                <button type="button" onClick={() => { if (tagsInput.trim() === "") return;
                    setTags([...tags, tagsInput]);
                    setTagsInput("");
                }}>Add</button>
                {tags.map((t) => (
                    <span key={t}>{t}</span>
                ))}
                <button type="button" onClick={() => {setIngredients([...ingredients, {name: "", original_text: "",  quantity: "", unit: "", preparation: "", section: "", is_optional: false }])}}>Add Ingredient</button>
                {ingredients.map((ingredient, index) => (
                    <div key={index}>
                        <input 
                            type="text"
                            placeholder="Ingredient name"
                            value={ingredient.name}
                            onChange={(e) => updateIngredient(index, "name", e.target.value)}
                        />
                        <input 
                            type="text"
                            placeholder="Original text (e.g. 2 tbsp soy sauce)"
                            value={ingredient.original_text}
                            onChange={(e) => updateIngredient(index, "original_text", e.target.value)}
                        />
                        <input 
                            type="number"
                            placeholder="Quantity"
                            value={ingredient.quantity ?? ""}
                            onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                        />
                        <input 
                            type="text"
                            placeholder="Unit"
                            value={ingredient.unit}
                            onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                        />
                        <input 
                            type="text"
                            placeholder="Preparation"
                            value={ingredient.preparation}
                            onChange={(e) => updateIngredient(index, "preparation", e.target.value)}
                        />
                        <input 
                            type="text"
                            placeholder="Section"
                            value={ingredient.section}
                            onChange={(e) => updateIngredient(index, "section", e.target.value)}
                        />
                        <label>
                            <input 
                                type="checkbox"
                                checked={ingredient.is_optional}
                                onChange={(e) => updateIngredient(index, "is_optional", e.target.checked)}
                            />
                            Optional
                        </label>
                    </div>
                ))}
                <button type="button" onClick={() => setInstructions([...instructions, {text: ""}])}>Add Instructions</button>
                {instructions.map((instruction, index) => (
                    <input 
                        key={index}
                        type="text"
                        placeholder={`Step ${index + 1}`}
                        value={instruction.text}
                        onChange={(e) => updateInstruction(index, e.target.value)}
                    />
                ))}
                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default RecipeCreateForm;