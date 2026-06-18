export type CatCarePromptRequest = {
  catName: string;
  mood: string;
  recentActions: string[];
};

export async function requestCatCareSuggestion(payload: CatCarePromptRequest) {
  const apiBase = import.meta.env.VITE_OPENAI_API_BASE;
  if (!apiBase) {
    return null;
  }

  const response = await fetch(`${apiBase}/cat-care-suggestion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Unable to fetch cat care suggestion.");
  }

  return response.json() as Promise<{ suggestion: string }>;
}
