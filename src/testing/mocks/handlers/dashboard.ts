import { HttpResponse, http } from "msw";

import { env } from "@/config/env";

import { db } from "../db";
import { requireAuth, networkDelay } from "../utils";

export const dashboardHandlers = [
  http.get(`${env.API_URL}/dashboard/stats`, async ({ cookies }) => {
    await networkDelay();

    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      // Calcular eventos activos (eventos que están actualmente en curso)
      const now = new Date().toISOString();
      const allEvents = db.event.findMany({});
      const activeEvents = allEvents.filter((event) => {
        const startDate = new Date(event.startDate).getTime();
        const endDate = new Date(event.endDate).getTime();
        const nowTime = new Date(now).getTime();
        return startDate <= nowTime && endDate >= nowTime;
      }).length;

      // Calcular total de proyectos
      const totalProjects = db.project.count();

      // Calcular miembros del jurado activos (con invitationStatus "accepted")
      const juryMembers = db.jury.findMany({
        where: {
          invitationStatus: {
            equals: "accepted",
          },
        },
      }).length;

      // Calcular evaluaciones completadas
      const evaluations = db.evaluation.count();

      return HttpResponse.json({
        activeEvents,
        totalProjects,
        juryMembers,
        evaluations,
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),
];
