import { HttpResponse, http } from "msw";

import { env } from "@/config/env";

import { db, persistDb } from "../db";

import {
  requireAuth,
  requireAdmin,
  networkDelay,
} from "../utils";

type CourseBody = {
  code: string;
  description?: string | undefined;
  eventId: string;
  active: boolean;
};

export const coursesHandlers = [
    http.get(`${env.API_URL}/courses`, async ({ cookies, request }) => {
        await networkDelay();

        try {
            
            const url = new URL(request.url);
            const eventId = url.searchParams.get("eventId");
            if (!eventId) {
                return HttpResponse.json(
                    { message: "eventId is required" },
                    { status: 400 },
                );
            }
            const courses = db.course
                .findMany({
                    where: {
                        eventId: { equals: eventId },
                    },
                });
            return HttpResponse.json(courses);
        } catch (error: any) {
            return HttpResponse.json(
                { message: error?.message || "Server Error" },
                { status: 500 },
            );
        }
    }),
];