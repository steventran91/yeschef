const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type RecipeCreateInput = {
    title: string;
    description?: string;
    servings?: number;
    prep_time_minutes?: number;
    cook_time_minutes?: number;
    cuisine?: string[];
    tags?: string[];
    ingredients: {
        name: string; 
        original_text: string;
        quantity?: number;
        unit?: string;
        preparation?: string;
        section?: string;
        is_optional?: boolean;
    }[];
    instructions: {
        text: string;
    }[];
}

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

export function setToken(token: string) {
    localStorage.setItem("token", token);
}

export function clearToken() {
    localStorage.removeItem("token");
}

async function apiFetch(path: string, options: RequestInit = {}) {
    const token = getToken();
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
    };
    if (token) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {...options, headers});

    if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.detail || `Request failed with status ${res.status}`);
    }

    return res.json();
}

export function login(email: string, password: string) {
    return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({email, password}),
    });
}

export function register(data: {first_name: string; last_name: string; email: string; password: string}) {
    return apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function getRecipes() {
    return apiFetch("/recipes");
}

export function getRecipe(id: string | number) {
    return apiFetch(`/recipes/${id}`);
}

export function getMe() {
    return apiFetch("/auth/me");
}

export function uploadRecipeImage(id: string | number, file: File) {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);

    return fetch(`${API_URL}/recipes/${id}/image`, {
        method: "POST",
        headers: token ? {Authorization: `Bearer ${token}`} : {},
        body: formData,
    }).then(async (res) => {
        if (!res.ok) {
            const errorBody = await res.json().catch(() => null);
            throw new Error(errorBody?.detail || `Request failed with status ${res.status}`);
        }
        return res.json();
    })
}

export function createRecipe(data: RecipeCreateInput) {
    return apiFetch("/recipes", {
        method: "POST", 
        body: JSON.stringify(data)
    })
}
