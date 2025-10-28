import { api } from "@/lib/api-client";

export const createEvent = async (eventData: {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  inscriptionDeadline: string;
  evaluationsStatus: "open" | "closed";
  isPublic?: boolean;
}): Promise<{ data: Event }> => {
  const response = (await api.post("/events", eventData)) as { data: Event };

  return response;
};
