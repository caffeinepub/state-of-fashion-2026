import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { backendInterface } from "../backend.d";
import { useActor } from "./useActor";

export interface RSVPFormData {
  name: string;
  email: string;
  phone: string;
}

export function useSubmitOpenRSVP() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RSVPFormData) => {
      if (!actor) throw new Error("Service unavailable. Please try again.");
      await (actor as unknown as backendInterface).submitOpenRSVP(
        data.name,
        data.email,
        data.phone,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["openRSVPs"] });
    },
  });
}

export function useGetAllOpenRSVPs() {
  const { actor } = useActor();

  return useQuery({
    queryKey: ["openRSVPs"],
    queryFn: async () => {
      if (!actor) return [];
      return await (actor as unknown as backendInterface).getAllOpenRSVPs();
    },
    enabled: !!actor,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
