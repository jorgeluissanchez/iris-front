import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { db, persistDb } from '../db';
import {
  requireAuth,
  requireAdmin,
  networkDelay,
} from '../utils';

type CriterionBody = {
    eventId: string;
    name: string;
    description?: string;
    weight: number;
    criterionCourse?: Array<{ courseId: string }>;
};

export const criterionHandlers = [
    http.get(`${env.API_URL}/criterion/:courseId`, async ({ params, cookies }) => {
        await networkDelay();
        try {
            const { error } = requireAuth(cookies);
            if (error) {
                return HttpResponse.json({ message: error }, { status: 401 });
            }

            const { courseId } = params as { courseId: string };
            if (!courseId) {
                return HttpResponse.json({ message: 'courseId is required' }, { status: 400 });
            }

            const items = db.criterion
                .getAll()
                .filter((c: any) =>
                    Array.isArray(c.criterionCourse) &&
                    c.criterionCourse.some((rel: any) => rel?.courseId === courseId)
                )
                .map(({ criterionCourse, ...rest }: any) => rest);

            return HttpResponse.json({ data: items });
        } catch (error: any) {
            return HttpResponse.json(
                { message: error?.message || 'Server Error' },
                { status: 500 },
            );
        }
    }),
    // GET paginado
    http.get(`${env.API_URL}/criterion`, async ({ cookies, request }) => {
        await networkDelay();
        try {
            const { error } = requireAuth(cookies);
            if (error) {
                return HttpResponse.json({ message: error }, { status: 401 });
            }
            const url = new URL(request.url);
            const page = Number(url.searchParams.get("page") || 1);
            const eventId = url.searchParams.get("eventId");
            const courseIdsRaw = url.searchParams.get("courseIds");
            const courseIds = courseIdsRaw
              ? courseIdsRaw.split(",").map((s) => s.trim()).filter(Boolean)
              : [];

            let all = db.criterion.getAll();
            if (eventId) {
                all = all.filter((c: any) => c.eventId === eventId);
            }
            if (courseIds.length > 0) {
                all = all.filter((c: any) => Array.isArray(c.criterionCourse) && c.criterionCourse.some((rel: any) => rel?.courseId && courseIds.includes(rel.courseId)));
            }
            const total = all.length;
            const totalPages = Math.ceil(total / 10);
            const criteria = all
                .slice((page - 1) * 10, page * 10)
                .map(({ criterionCourse, ...rest }: any) => rest);
            return HttpResponse.json({
                data: criteria,
                meta: { total, page, totalPages },
            });
        } catch (error: any) {
            return HttpResponse.json(
                { message: error?.message || "Server Error" },
                { status: 500 }
            );
        }
    }),

    // GET por id
    http.get(`${env.API_URL}/criterion/:id`, async ({ params, cookies }) => {
        await networkDelay();
        try {
            const { error } = requireAuth(cookies);
            if (error) {
                return HttpResponse.json({ message: error }, { status: 401 });
            }
            const criterionId = params.id as string;
            const criterion = db.criterion.findFirst({
                where: { id: { equals: criterionId } },
            });
            if (!criterion) {
                return HttpResponse.json(
                    { message: "Criterion not found" },
                    { status: 404 }
                );
            }
            const { criterionCourse, ...rest } = criterion as any;
            const criterionCourses = Array.isArray(criterionCourse)
              ? criterionCourse.map((rel: any) => ({
                  id: rel.id ?? `${criterion.id}-${rel.courseId}`,
                  courseId: rel.courseId,
                  criterionId: criterion.id,
                }))
              : [];
            return HttpResponse.json({ data: { ...rest, criterionCourses } });
        } catch (error: any) {
            return HttpResponse.json(
                { message: error?.message || "Server Error" },
                { status: 500 }
            );
        }
    }),

    // POST
    http.post(`${env.API_URL}/criterion`, async ({ cookies, request }) => {
        await networkDelay();
        try {
            const { error } = requireAuth(cookies);
            if (error) {
                return HttpResponse.json({ message: error }, { status: 401 });
            }
            const body = await request.json();
            if (!body || typeof body !== "object" || !body.eventId || !body.name || typeof body.weight !== "number") {
                return HttpResponse.json({ message: "Invalid body" }, { status: 400 });
            }
            const criterionBody: CriterionBody = {
                eventId: body.eventId,
                name: body.name,
                description: body.description,
                weight: body.weight,
                criterionCourse: body.criterionCourse,
            };
            const created = db.criterion.create(criterionBody);
            await persistDb("criterion");
            return HttpResponse.json({ data: created }, { status: 201 });
        } catch (error: any) {
            return HttpResponse.json(
                { message: error?.message || "Server Error" },
                { status: 500 }
            );
        }
    }),

    // PATCH
    http.patch(`${env.API_URL}/criterion/:id`, async ({ cookies, request, params }) => {
        await networkDelay();
        try {
            const { error } = requireAuth(cookies);
            if (error) {
                return HttpResponse.json({ message: error }, { status: 401 });
            }
            const criterionId = params.id as string;
            const data = await request.json();
            if (!data || typeof data !== "object") {
                return HttpResponse.json({ message: "Invalid body" }, { status: 400 });
            }
            // Solo tomar los campos válidos de CriterionBody
            const updateData: Partial<CriterionBody> = {};
            if (typeof data.eventId === "string") updateData.eventId = data.eventId;
            if (typeof data.name === "string") updateData.name = data.name;
            if (typeof data.description === "string") updateData.description = data.description;
            if (typeof data.weight === "number") updateData.weight = data.weight;
            if (Array.isArray(data.criterionCourse)) updateData.criterionCourse = data.criterionCourse;
            const criterion = db.criterion.update({
                where: { id: { equals: criterionId } },
                data: updateData,
            });
            if (!criterion) {
                return HttpResponse.json(
                    { message: "Criterion not found" },
                    { status: 404 }
                );
            }
            await persistDb("criterion");
            return HttpResponse.json({ data: criterion });
        } catch (error: any) {
            return HttpResponse.json(
                { message: error?.message || "Server Error" },
                { status: 500 }
            );
        }
    }),

    // DELETE
    http.delete(`${env.API_URL}/criterion/:id`, async ({ params, cookies }) => {
        await networkDelay();
        try {
            const { error } = requireAuth(cookies);
            if (error) {
                return HttpResponse.json({ message: error }, { status: 401 });
            }
            const criterionId = params.id as string;
            const criterion = db.criterion.delete({
                where: { id: { equals: criterionId } },
            });
            if (!criterion) {
                return HttpResponse.json(
                    { message: "Criterion not found" },
                    { status: 404 }
                );
            }
            await persistDb("criterion");
            return HttpResponse.json({ data: criterion });
        } catch (error: any) {
            return HttpResponse.json(
                { message: error?.message || "Server Error" },
                { status: 500 }
            );
        }
    }),
];