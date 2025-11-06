import { HttpResponse, http } from "msw";

import { env } from "@/config/env";

import { db, persistDb } from "../db";
import {
  requireAuth,
  // requireAdmin,
  networkDelay,
} from "../utils";

type EventBody = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  inscriptionDeadline?: string;
  evaluationsStatus?: "open" | "closed";
  isPublic?: boolean;
};

export const eventsHandlers = [
  http.get(`${env.API_URL}/events`, async ({ cookies, request }) => {
    await networkDelay();

    try {
      const { /*user,*/ error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page") || 1);

      const total = db.event.count();
      const totalPages = Math.ceil(total / 10);

      const events = db.event
        .findMany({
          take: 10,
          skip: 10 * (page - 1),
        })
        .map((event) => {
          return {
            id: event.id,
            title: event.title,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            inscriptionDeadline: event.inscriptionDeadline,
            accessCode: event.accessCode,
            isPublic: event.isPublic,
            evaluationsStatus: event.evaluationsStatus,
            createdAt: event.createdAt,
          };
        });

      return HttpResponse.json({
        data: events,
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

  http.get(`${env.API_URL}/events-dropdown`, async ({ cookies }) => {
    await networkDelay();

    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const events = db.event.findMany({}).map((event) => {
        return {
          id: event.id,
          title: event.title,
        };
      });

      return HttpResponse.json({ data: events });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),

  http.get(`${env.API_URL}/events/:eventId`, async ({ params, cookies }) => {
    await networkDelay();

    try {
      const { /*user,*/ error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const eventId = params.eventId as string;
      const event = db.event.findFirst({
        where: {
          id: {
            equals: eventId,
          },
        },
      });

      if (!event) {
        return HttpResponse.json(
          { message: "Event not found" },
          { status: 404 }
        );
      }

      return HttpResponse.json({
        data: event,
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),

  http.post(`${env.API_URL}/events`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }
      const data = (await request.json()) as EventBody;
      // requireAdmin(user);

      const event = db.event.create({
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        inscriptionDeadline: data.inscriptionDeadline ?? data.startDate,
        accessCode: `EVT${Date.now().toString().slice(-6)}`,
        isPublic: data.isPublic ?? true,
        evaluationsStatus: data.evaluationsStatus ?? "closed",
      });

      await persistDb("event");

      return HttpResponse.json({ data: event });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),

  http.patch(`${env.API_URL}/events/:eventId`, async ({ params, request, cookies }) => {
      await networkDelay();

      try {
        const { /*user,*/ error } = requireAuth(cookies);
        if (error) {
          return HttpResponse.json({ message: error }, { status: 401 });
        }
        const eventId = params.eventId as string;
        const data = (await request.json()) as Partial<EventBody>;
        // requireAdmin(user);
        const event = db.event.update({
          where: {
            id: {
              equals: eventId,
            },
          },
          data: {
            ...(data.title && { title: data.title }),
            ...(data.description && { description: data.description }),
            ...(data.startDate && { startDate: data.startDate }),
            ...(data.endDate && { endDate: data.endDate }),
            ...(data.inscriptionDeadline && {
              inscriptionDeadline: data.inscriptionDeadline,
            }),
            ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
            ...(data.evaluationsStatus && {
              evaluationsStatus: data.evaluationsStatus,
            }),
          },
        });

        if (!event) {
          return HttpResponse.json(
            { message: "Event not found" },
            { status: 404 }
          );
        }

        await persistDb("event");

        return HttpResponse.json({ data: event });
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || "Server Error" },
          { status: 500 }
        );
      }
    }
  ),

  http.delete(`${env.API_URL}/events/:eventId`, async ({ params, cookies }) => {
    await networkDelay();

    try {
      const { /*user,*/ error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }
      const eventId = params.eventId as string;
      // requireAdmin(user);
      const event = db.event.delete({
        where: {
          id: {
            equals: eventId,
          },
        },
      });

      if (!event) {
        return HttpResponse.json(
          { message: "Event not found" },
          { status: 404 }
        );
      }

      await persistDb("event");

      return HttpResponse.json({ data: event });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),
];
