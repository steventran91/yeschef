"use client";

import { useState } from "react";
import { createRecipe } from "@/lib/api";

function RecipeCreateForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [servings, setServings] = useState("");
    const [prepTime, setPrepTime] = useState("");
    const [cookTime, setCookTime] = useState("");
    const [cuisine, setCuisine] = useState<string[]>([]);
    const [cuisineInput, setCuisineInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagsInput, setTagsInput] = useState("");
    const [ingredients, setIngredients] = useState<{
        name: string;
        original_text: string;
        quantity?: number;
        unit?: string;
        preparation?: string;
        section?: string;
        is_optional?: boolean;
    }[]>([]);
    const [instructions, setInstructions] = useState<{
        text: string;
    }[]>([]);

    function updateIngredient(index: number, field: string, value: string | number | boolean) {
        const updated = [...ingredients];
        updated[index] = {...updated[index], [field]: value};
        setIngredients(updated);
    }

    function updateInstructions(index: number, value: string) {
        const updated = [...instructions];
        updated[index] = {text: value};
        setInstructions(updated);
    }

    return (
        <div>
            <form>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                <input type="number" placeholder="Servings" value={servings} onChange={(e) => setServings(e.target.value)}/>
                <input type="number" placeholder="Prep Time" value={prepTime} onChange={(e) => setPrepTime(e.target.value)}/>
                <input type="number" placeholder="Cook Time" value={cookTime} onChange={(e) => setCookTime(e.target.value)}/>
                <input type="text" placeholder="Cuisine" value={cuisineInput} onChange={(e) => setCuisineInput(e.target.value)}/>
                <button type="button" onClick={() => {setCuisine([...cuisine, cuisineInput]); setCuisineInput("");}}>Add</button>
                {cuisine.map((c) => (
                    <span key={c}>{c}</span>
                ))}
                <input type="text" placeholder="Tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}/>
                <button type="button" onClick={() => {setTags([...tags, tagsInput]); setTagsInput("");}}>Add</button>
                {tags.map((t) => (
                    <span key={t}>{t}</span>
                ))}
                <button type="button" onClick={() => {setIngredients([...ingredients, {name: "", original_text: "",  quantity: undefined, unit: "", preparation: "", section: "", is_optional: false }])}}>Add Ingredient</button>
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
                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default RecipeCreateForm;