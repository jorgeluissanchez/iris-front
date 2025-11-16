import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export type RejectPayload = {
  projectId: number;
  reason: string;
};

export type RejectResponse = {
  id: number;
  reason: string;
};

export const RejectProject = async ({ projectId, reason }: RejectPayload): Promise<RejectResponse> => {
    console.log("Rechazando proyecto:", projectId,"tipo", typeof(projectId) ,"con motivo:", reason);
  const res = await api.patch<RejectResponse>(`/projects/${projectId}/reject`, { reason });
  return res;
};

export const useRejectProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, reason }: RejectPayload) => RejectProject({ projectId, reason }),
    onSuccess: (data, variables) => {
      console.log("Proyecto rechazado:", variables.projectId, "data:", data);
      // Refrescar la lista de proyectos
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (err) => {
      console.error("Error al rechazar:", err);
    },
  });
};
