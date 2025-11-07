import { HttpResponse, http } from "msw";

import { env } from "@/config/env";
import { db, persistDb } from "../db";
import { requireAuth, networkDelay } from "../utils";

type JuryBody = {
  email: string;
  eventId: string;
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
          eventId: jury.eventId,
          invitationStatus: jury.invitationStatus,
          createdAt: jury.createdAt,
          // Get the event title for display in the table
          event:
            db.event.findFirst({
              where: {
                id: {
                  equals: jury.eventId,
                },
              },
            })?.title || "Unknown Event",
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

        const total = db.jury.count({
          where: {
            eventId: {
              equals: eventId,
            },
          },
        });
        const totalPages = Math.ceil(total / 10);

        const juries = db.jury
          .findMany({
            where: {
              eventId: {
                equals: eventId,
              },
            },
            take: 10,
            skip: 10 * (page - 1),
          })
          .map((jury) => ({
            id: jury.id,
            email: jury.email,
            eventId: jury.eventId,
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
  http.post(`${env.API_URL}/juries`, async ({ params, request, cookies }) => {
    await networkDelay();

    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const eventId = params.eventId as string;
      const data = (await request.json()) as JuryBody;

      // Check if jury already exists for this event
      const existingJury = db.jury.findFirst({
        where: {
          email: {
            equals: data.email,
          },
          eventId: {
            equals: eventId,
          },
        },
      });

      if (existingJury) {
        return HttpResponse.json(
          { message: "Jury already invited to this event" },
          { status: 400 }
        );
      }

      const jury = db.jury.create({
        email: data.email,
        eventId: eventId,
        invitationStatus: "pending",
      });

      await persistDb("jury");

      return HttpResponse.json({ data: jury });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),

  // Update jury invitation status
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
          invitationStatus: "pending" | "accepted" | "declined";
        };

        const jury = db.jury.update({
          where: {
            id: {
              equals: juryId,
            },
          },
          data: {
            invitationStatus: data.invitationStatus,
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
