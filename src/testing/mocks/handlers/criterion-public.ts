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

export const criterionPublicHandlers = [
    http.get(`${env.API_URL}/criterion-public/:courseId`, async ({ params, cookies }) => {
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

            const filtered = db.criterion_public
                .getAll()
                .filter((c: any) =>
                    Array.isArray(c.criterionCourse) &&
                    c.criterionCourse.some((rel: any) => rel?.courseId === courseId)
                )
                .map(({ criterionCourse, ...rest }) => rest);
            
            return HttpResponse.json({ data: filtered });
        } catch (error: any) {
            return HttpResponse.json(
                { message: error?.message || 'Server Error' },
                { status: 500 },
            );
        }
    }),
];