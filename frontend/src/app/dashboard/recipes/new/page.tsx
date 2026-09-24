"use client";

import { useState } from "react";
import RecipeCreateForm from "@/components/RecipeCreateForm"

function NewRecipePage() {
    const [mode, setMode] = useState<"manual" | "import">("manual");
    const [files, setFiles] = useState<File[]>([]);
    const [extracting, setExtracting] = useState(false);

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
                </div>
            )}
            {mode === "manual" && <RecipeCreateForm/>}
        </div>
    )
}

export default NewRecipePage;