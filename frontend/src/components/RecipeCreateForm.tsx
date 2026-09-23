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
                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default RecipeCreateForm;