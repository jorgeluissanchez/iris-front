import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { db, persistDb } from '../db';
import {
    requireAuth,
    requireAdmin,
    networkDelay,
} from '../utils';

type ProjectBody = {
    eventId: string;
    courseId: string;
    name: string;
    logo: string;
    description?: string | undefined;
    eventNumber?: string | undefined;
    state: string;
};

export const projectsPublicHandlers = [
    http.post(`${env.API_URL}/projects-public`, async ({ cookies, request }) => {
        await networkDelay();

        try {
            const data = (await request.json()) as ProjectBody;
            const result = db.project_public.create({
                eventId: data.eventId,
                courseId: data.courseId,
                name: data.name,
                logo: data.logo,
                description: data.description || undefined,
                eventNumber: undefined,
                state: "UNDER_REVIEW",
                createdAt: Date.now(),
            });
            await persistDb('project_public');
            return HttpResponse.json(result);
        } catch (error: any) {
            return HttpResponse.json(
                { message: error?.message || 'Server Error' },
                { status: 500 },
            );
        }
    }),

  http.get(`${env.API_URL}/projects-public`, async ({ cookies, request }) => {
    await networkDelay();

    try {
      // const { /*user,*/ error } = requireAuth(cookies);
      // if (error) {
      //   return HttpResponse.json({ message: error }, { status: 401 });
      // }

      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page') || 1);

      const total = db.event.count();
      const totalPages = Math.ceil(total / 10);

      const projects = db.project_public
        .findMany({
          take: 10,
          skip: 10 * (page - 1),
        })
        .map((project) => {
          return {
            id: project.id,
            name: project.name,
            description: project.description,
            logo: project.logo,
            state: project.state,
            createdAt: project.createdAt,
          };
        });

      return HttpResponse.json({
        data: projects,
        meta: {
          page,
          total,
          totalPages,
        },
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),
];
