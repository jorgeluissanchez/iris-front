import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { db, persistDb } from '../db';
import {
    requireAuth,
    requireAdmin,
    networkDelay,
} from '../utils';

type ProjectBody = {
    eventId: number;
    courseId: number;
    name: string;
    description?: string;
    eventNumber?: string;
    state: string;
};

export const projectsHandlers = [
    http.post(`${env.API_URL}/projects`, async ({ cookies, request }) => {
        await networkDelay();

        try {
            const data = (await request.json()) as ProjectBody;
            const result = db.project.create({
                eventId: data.eventId,
                courseId: data.courseId,
                name: data.name,
                description: data.description || '',
                eventNumber: data.eventNumber || '',
                state: data.state,
                createdAt: Date.now(),
            });
            await persistDb('project');
            return HttpResponse.json(result);
        } catch (error: any) {
            return HttpResponse.json(
                { message: error?.message || 'Server Error' },
                { status: 500 },
            );
        }
    }),
];
