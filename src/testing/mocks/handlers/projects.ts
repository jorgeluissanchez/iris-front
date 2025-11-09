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
  documents?: Array<{ type: string; url: string }>;
  participants?: Array<{
    firstName: string;
    lastName: string;
    email: string;
    studentCode?: string;
  }>;
  jurorAssignments?: Array<{
    memberUserId: string;
  }>;
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
        logo: data.logo,
        description: data.description || undefined,
        eventNumber: undefined,
        state: "UNDER_REVIEW",
        createdAt: Date.now(),
        documents: data.documents ?? [],
        participants: data.participants ?? [],
        jurorAssignments: [],
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

  http.get(`${env.API_URL}/projects/:id`, async ({ cookies, request }) => {
    await networkDelay();
    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }
      const url = new URL(request.url);
      const projectId = url.pathname.split('/')[3];
      if (!projectId) {
        return HttpResponse.json(
          { message: 'projectId is required' },
          { status: 400 },
        );
      }
      const project = db.project.findFirst({ where: { id: { equals: projectId } } });
      if (!project) {
        return HttpResponse.json(
          { message: 'Project not found' },
          { status: 404 },
        );
      }
      return HttpResponse.json({ data: project });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),

  http.get(`${env.API_URL}/projects`, async ({ cookies, request }) => {
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

      const projects = db.project
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
            documents: project.documents ?? [],
            participants: project.participants ?? [],
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

  http.get(`${env.API_URL}/events/:id/projects`, async ({ cookies, request }) => {
    await networkDelay();
    try {
      const { user, error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }
      const url = new URL(request.url);
      const eventId = url.pathname.split('/')[3];

      if (!eventId) {
        return HttpResponse.json(
          { message: 'eventId is required' },
          { status: 400 },
        );
      }

      const jurorId = (user as any)?.id ?? (user as any)?.userId;
      if (!jurorId) {
        return HttpResponse.json(
          { message: 'jurorId not found on user' },
          { status: 400 },
        );
      }

      const page = Number(url.searchParams.get('page') || 1);
      const pageSize = Number(url.searchParams.get('pageSize') || 10);

      const filtered = db.project
        .getAll()
        .filter(p => String(p.eventId) === String(eventId))
        .filter((p: any) => {
          const list = p.jurorAssignments ?? [];
          return list.some((it: any) =>
            typeof it === 'string' ? it === jurorId : it?.memberUserId === jurorId
          );
        });

      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const pageItems = filtered.slice(start, end);

      const projects = pageItems.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        logo: project.logo,
        state: project.state,
        eventNumber: project.eventNumber || "",
        createdAt: project.createdAt,
        documents: project.documents ?? [],
        participants: project.participants ?? [],
      }));

      return HttpResponse.json({ data: projects, meta: { page, total, totalPages } });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),

  http.patch(`${env.API_URL}/projects/:id`, async ({ cookies, request, params }) => {
    await networkDelay();
    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const projectId = params.id as string;
      const data = await request.json();

      if (!data || typeof data !== "object") {
        return HttpResponse.json({ message: "Invalid body" }, { status: 400 });
      }

      const updateData: Partial<ProjectBody> = {};
      if (typeof data.eventId === "string") updateData.eventId = data.eventId;
      if (typeof data.courseId === "string") updateData.courseId = data.courseId;
      if (typeof data.name === "string") updateData.name = data.name;
      if (typeof data.logo === "string") updateData.logo = data.logo;
      if (typeof data.description === "string") updateData.description = data.description;
      if (typeof data.state === "string") updateData.state = data.state;
      if (Array.isArray(data.documents)) updateData.documents = data.documents;
      if (Array.isArray(data.participants)) updateData.participants = data.participants;
      if (Array.isArray(data.jurorAssignments)) updateData.jurorAssignments = data.jurorAssignments;

      const project = db.project.update({
        where: { id: { equals: projectId } },
        data: updateData,
      });

      if (!project) {
        return HttpResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      }

      await persistDb("project");
      return HttpResponse.json({ data: project });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),

  http.delete(`${env.API_URL}/projects/:id`, async ({ cookies, params }) => {
    await networkDelay();
    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const projectId = params.id as string;
      const project = db.project.delete({
        where: { id: { equals: projectId } },
      });

      if (!project) {
        return HttpResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      }

      await persistDb("project");
      return HttpResponse.json({ data: project });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),
];
