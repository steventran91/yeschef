"use client";

import { useState } from "react";
import RecipeCreateForm from "@/components/RecipeCreateForm"
import { extractRecipeFromImage } from "@/lib/api";

function NewRecipePage() {
    const [mode, setMode] = useState<"manual" | "import">("manual");
    const [files, setFiles] = useState<File[]>([]);
    const [extracting, setExtracting] = useState(false);
    const [extractedData, setExtractedData] = useState<{
        title?: string;
        description?: string;
        servings?: number;
        prep_time_minutes?: number;
        cook_time_minutes?: number;
        cuisin?: string[];
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

    return (
        <div>
            <button type="button" onClick={() => setMode("manual")}>Create Manually</button>
            <button type="button" onClick={() => setMode("import")}>Import from Photo</button>
            {mode === "import" && (
                <div>
                    <input 
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
                    />    
                    <button type="button" onClick={handleExtract} disabled={extracting}>
                        {extracting ? "Extracting..." : "Extract Recipe"}
                    </button>
                    {extractError && <p>{extractError}</p>}
                </div>
            )}
            {mode === "manual" && <RecipeCreateForm/>}
        </div>
    )
}

export default NewRecipePage;