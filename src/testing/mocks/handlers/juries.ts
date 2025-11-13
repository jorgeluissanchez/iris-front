import { HttpResponse, http } from "msw";

import { env } from "@/config/env";
import { db, persistDb } from "../db";
import { requireAuth, networkDelay } from "../utils";

type JuryBody = {
  email: string;
  eventIds: string[];
  projectIds: string[];
};

export const juriesHandlers = [
  http.get(`${env.API_URL}/juries`, async ({ cookies, request }) => {
    await networkDelay();

    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page") || 1);

      const total = db.jury.count();
      const totalPages = Math.ceil(total / 10);

      const juries = db.jury
        .findMany({
          take: 10,
          skip: 10 * (page - 1),
        })
        .map((jury) => ({
          id: jury.id,
          email: jury.email,
          eventIds: jury.eventIds || [],
          projectIds: jury.projectIds || [],
          invitationStatus: jury.invitationStatus,
          createdAt: jury.createdAt,
        }));

      return HttpResponse.json({
        data: juries,
        meta: {
          page,
          total,
          totalPages,
        },
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),

  // Get all juries for an event
  http.get(
    `${env.API_URL}/events/:eventId/juries`,
    async ({ params, cookies, request }) => {
      await networkDelay();

      try {
        const { error } = requireAuth(cookies);
        if (error) {
          return HttpResponse.json({ message: error }, { status: 401 });
        }

        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page") || 1);
        const eventId = params.eventId as string;

        const allJuries = db.jury.getAll();
        const filteredJuries = allJuries.filter((jury) => {
          const eventIds = jury.eventIds || [];
          return eventIds.includes(eventId);
        });

        const total = filteredJuries.length;
        const totalPages = Math.ceil(total / 10);

        const juries = filteredJuries
          .slice(10 * (page - 1), 10 * page)
          .map((jury) => ({
            id: jury.id,
            email: jury.email,
            eventIds: jury.eventIds || [],
            projectIds: jury.projectIds || [],
            invitationStatus: jury.invitationStatus,
            createdAt: jury.createdAt,
          }));

        return HttpResponse.json({
          data: juries,
          meta: {
            page,
            total,
            totalPages,
          },
        });
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || "Server Error" },
          { status: 500 }
        );
      }
    }
  ),

  // Invite a new jury
  http.post(`${env.API_URL}/juries`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const data = (await request.json()) as JuryBody;

      // Check if jury already exists with the same email and event/project combination
      const allJuries = db.jury.getAll();
      const existingJury = allJuries.find((jury) => {
        if (jury.email !== data.email) return false;
        const juryEventIds = jury.eventIds || [];
        const juryProjectIds = jury.projectIds || [];
        
        // Check if there's any overlap in events or projects
        const hasEventOverlap = data.eventIds.some((eid) => juryEventIds.includes(eid));
        const hasProjectOverlap = data.projectIds.some((pid) => juryProjectIds.includes(pid));
        
        return hasEventOverlap || hasProjectOverlap;
      });

      if (existingJury) {
        return HttpResponse.json(
          { message: "Jury already invited with overlapping events or projects" },
          { status: 400 }
        );
      }

      const jury = db.jury.create({
        email: data.email,
        eventIds: data.eventIds || [],
        projectIds: data.projectIds || [],
        invitationStatus: "pending",
      });

      await persistDb("jury");

      return HttpResponse.json({ 
        data: {
          id: jury.id,
          email: jury.email,
          eventIds: jury.eventIds || [],
          projectIds: jury.projectIds || [],
          invitationStatus: jury.invitationStatus,
          createdAt: jury.createdAt,
        }
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),

  // Update jury invitation status or details
  http.patch(
    `${env.API_URL}/juries/:juryId`,
    async ({ params, request, cookies }) => {
      await networkDelay();

      try {
        const { error } = requireAuth(cookies);
        if (error) {
          return HttpResponse.json({ message: error }, { status: 401 });
        }

        const juryId = params.juryId as string;
        const data = (await request.json()) as {
          invitationStatus?: "pending" | "accepted" | "declined";
          email?: string;
          eventIds?: string[];
          projectIds?: string[];
        };

        const updateData: any = {};
        if (data.invitationStatus) {
          updateData.invitationStatus = data.invitationStatus;
        }
        if (data.email) {
          updateData.email = data.email;
        }
        if (data.eventIds !== undefined) {
          updateData.eventIds = data.eventIds;
        }
        if (data.projectIds !== undefined) {
          updateData.projectIds = data.projectIds;
        }

        const jury = db.jury.update({
          where: {
            id: {
              equals: juryId,
            },
          },
          data: updateData,
        });

        if (!jury) {
          return HttpResponse.json(
            { message: "Jury not found" },
            { status: 404 }
          );
        }

        await persistDb("jury");

        return HttpResponse.json({ 
          data: {
            id: jury.id,
            email: jury.email,
            eventIds: jury.eventIds || [],
            projectIds: jury.projectIds || [],
            invitationStatus: jury.invitationStatus,
            createdAt: jury.createdAt,
          }
        });
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || "Server Error" },
          { status: 500 }
        );
      }
    }
  ),

  // Delete a jury invitation
  http.delete(`${env.API_URL}/juries/:juryId`, async ({ params, cookies }) => {
    await networkDelay();

    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const juryId = params.juryId as string;
      const jury = db.jury.delete({
        where: {
          id: {
            equals: juryId,
          },
        },
      });

      if (!jury) {
        return HttpResponse.json(
          { message: "Jury not found" },
          { status: 404 }
        );
      }

      await persistDb("jury");

      return HttpResponse.json({ data: jury });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),
];
