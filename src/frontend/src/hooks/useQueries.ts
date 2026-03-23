import { useMutation } from "@tanstack/react-query";
import { useActor } from "./useActor";

export interface RSVPFormData {
  name: string;
  email: string;
  phone?: string;
}

export function useSubmitRSVP() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: RSVPFormData) => {
      if (!actor) throw new Error("Service unavailable. Please try again.");
      await actor.submitRSVP(data.name, true, "");
    },
  });
}
