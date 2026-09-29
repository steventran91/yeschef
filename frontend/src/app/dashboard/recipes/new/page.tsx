"use client";

import { useState, useEffect } from "react";
import RecipeCreateForm from "@/components/RecipeCreateForm"
import { extractRecipeFromImage, getRecipe } from "@/lib/api";
import { useSearchParams } from "next/navigation";

function NewRecipePage() {
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const [mode, setMode] = useState<"manual" | "import">("manual");
    const [files, setFiles] = useState<File[]>([]);
    const [extracting, setExtracting] = useState(false);
    const [extractedData, setExtractedData] = useState<{
        title?: string;
        description?: string;
        servings?: number;
        prep_time_minutes?: number;
        cook_time_minutes?: number;
        cuisine?: string[];
        tags?: string[];
        ingredients?: {
            name: string;
            original_text: string;
            quantity?: number;
            unit?: string;
            preparation?: string;
            section?: string;
            is_optional?: boolean
        }[];
        instructions?: {text: string;}[];
        warnings?: string[];
    } | null>(null);
    const [extractError, setExtractError] = useState<string | null>(null);
    const [editRecipe, setEditRecipe] = useState<{
            id: number;
            title?: string;
            description?: string;
            servings?: number;
            prep_time_minutes?: number;
            cook_time_minutes?: number;
            cuisine?: string[];
            tags?: string[];
            ingredients?: {
                name: string; original_text: string; quantity?: number; unit?: string; preparation?: string; section?: string; is_optional?: boolean
            }[];
            instructions?: {text: string; section?: string;}[];
    } | null>(null);
    const [loadingEdit, setLoadingEdit] = useState(!!editId);

    useEffect(() => {
        if (!editId) return;
        getRecipe(editId)
          .then((data) => setEditRecipe(data))
          .finally(() => setLoadingEdit(false));
    }, [editId]); 

    async function handleExtract() {
        if (files.length === 0) return;
        setExtracting(true);

        try {
            const extracted = await extractRecipeFromImage(files);
            setExtractedData(extracted);
        } catch (err) {
            setExtractError(err instanceof Error ? err.message : "Failed to extract data from image.")
        } finally {
            setExtracting(false);
        }
    }

    const tabButtonClass = (isActive: boolean) =>
        `rounded-md border px-4 py-2 text-sm font-medium ${
            isActive
                ? "border-[#7C9074] bg-[#7C9074] text-white"
                : "border-[#7C9074]/40 text-[#7C9074] hover:border-[#7C9074]"
        }`;

    if (editId) {
        if (loadingEdit) return <p>Loading recipe...</p>
        if (!editRecipe) return <p>Recipe not found.</p>

        return (
            <div className="space-y-6 text-[#7C9074]">
                <h1 className="text-lg font-semibold">Edit Recipe</h1>
                <RecipeCreateForm initialData={editRecipe} recipeId={editRecipe.id}/>
            </div>
        )
    }

    return (
        <div className="space-y-6 text-[#7C9074]">
            <div className="flex gap-3">
                <button type="button" className={tabButtonClass(mode === "manual")} onClick={() => setMode("manual")}>Create Manually</button>
                <button type="button" className={tabButtonClass(mode === "import")} onClick={() => setMode("import")}>Import from Photo</button>
            </div>

            {mode === "import" && (
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
                            className="text-sm text-[#7C9074] file:mr-3 file:rounded-md file:border file:border-[#7C9074] file:bg-white file:px-3 file:py-1 file:text-sm file:text-[#7C9074] file:hover:bg-[#7C9074] file:hover:text-white"
                        />
                        <button
                            type="button"
                            onClick={handleExtract}
                            disabled={extracting}
                            className="rounded-md border border-[#7C9074] px-4 py-2 text-sm font-medium text-[#7C9074] hover:bg-[#7C9074] hover:text-white disabled:opacity-50"
                        >
                            {extracting ? "Extracting..." : "Extract Recipe"}
                        </button>
                    </div>

                    {extractError && <p className="text-sm text-red-600">{extractError}</p>}

                    {extractedData && (
                        <div className="space-y-4">
                            {extractedData.warnings && extractedData.warnings.length > 0 && (
                                <div className="rounded-md border border-amber-400/50 bg-amber-50 p-3">
                                    <p className="text-sm font-semibold text-amber-700">Please review:</p>
                                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-amber-700">
                                        {extractedData.warnings.map((warning) => (
                                            <li key={warning}>{warning}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <RecipeCreateForm initialData={extractedData}/>
                        </div>
                    )}
                </div>
            )}

            {mode === "manual" && <RecipeCreateForm/>}
        </div>
    )
}

export default NewRecipePage;