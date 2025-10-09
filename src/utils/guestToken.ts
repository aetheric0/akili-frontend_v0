export function getOrCreateGuestToken(): string {
    const STORAGE_KEY = "guest_token";

    let token = localStorage.getItem(STORAGE_KEY);

    if (!token) {
        token = crypto.randomUUID();
        localStorage.setItem(STORAGE_KEY, token)
    }

    return token;
}