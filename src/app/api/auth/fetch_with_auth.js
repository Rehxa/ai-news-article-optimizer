import { auth } from "@/lib/firebase/client";

export async function fetchWithAuth(url, options = {}) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const token = await user.getIdToken();

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Authorization", `Bearer ${token}`);

  return fetch(url, {
    ...options,
    headers,
  });
}
