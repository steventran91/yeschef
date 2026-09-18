const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export function getMe() {
    return apiFetch("/auth/me");
}