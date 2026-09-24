"use client";

import { useState } from "react";
import RecipeCreateForm from "@/components/RecipeCreateForm"

function NewRecipePage() {
    const [mode, setMode] = useState<"manual" | "import">("manual");

    return (
        <div>
            <button type="button" onClick={() => setMode("manual")}>Create Manually</button>
            <button type="button" onClick={() => setMode("import")}>Import from Photo</button>
            {mode === "manual" && <RecipeCreateForm/>}
        </div>
    )
}

export default NewRecipePage;