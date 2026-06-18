export type ItineraryDay = {
  day: number;
  title: string;
  summary: string;
  activities: string[];
  food_recommendations: string[];
  travel_tip: string;
};

export type Trip = {
  id: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  budget: string;
  travel_style: string;
  interests: string[];
  itinerary: ItineraryDay[];
  created_at: string;
};

export type ItineraryRequest = {
  destination: string;
  start_date?: string | null;
  end_date?: string | null;
  budget: string;
  travel_style: string;
  interests: string[];
  days: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function generateItinerary(payload: ItineraryRequest) {
  return request<Trip>("/api/generate-itinerary", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listTrips() {
  return request<Trip[]>("/api/trips");
}
