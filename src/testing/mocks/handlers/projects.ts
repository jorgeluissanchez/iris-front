import { HttpResponse, http } from "msw";

import { env } from "@/config/env";

import { db, persistDb } from "../db";
import {
  requireAuth,
  // requireAdmin,
  networkDelay,
} from "../utils";

type ProjectBody = {
  title: string;
  description?: string;
  eventId?: string;
  teamMembers?: Array<{ name: string; photoUrl?: string }>;
  teamId?: string;
  isPublic?: boolean;
  approvedAt?: number | null;
  submittedAt?: number | null;
};

export const projectsHandlers = [
  http.get(`${env.API_URL}/projects`, async ({ cookies, request }) => {
    await networkDelay();

    try {
      const { /*user,*/ error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page") || 1);

      const total = db.project.count();
      const totalPages = Math.ceil(total / 10);

      const projects = db.project
        .findMany({
          take: 10,
          skip: 10 * (page - 1),
        })
        .map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          eventId: project.eventId,
          teamMembers: project.teamMembers,
          teamId: project.teamId,
          isPublic: project.isPublic,
          createdAt: project.createdAt,
          submittedAt: project.submittedAt,
          approvedAt: project.approvedAt,
        }));

      return HttpResponse.json({
        data: projects,
        meta: { page, total, totalPages },
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),

  http.get(
    `${env.API_URL}/projects/:projectId`,
    async ({ params, cookies }) => {
      await networkDelay();

      try {
        const { /*user,*/ error } = requireAuth(cookies);
        if (error) {
          return HttpResponse.json({ message: error }, { status: 401 });
        }

        const projectId = params.projectId as string;
        const project = db.project.findFirst({
          where: { id: { equals: projectId } },
        });

        if (!project) {
          return HttpResponse.json(
            { message: "Project not found" },
            { status: 404 }
          );
        }

        return HttpResponse.json({ data: project });
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || "Server Error" },
          { status: 500 }
        );
      }
    }
  ),

  http.post(`${env.API_URL}/projects`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const data = (await request.json()) as ProjectBody;
      // requireAdmin(user);

      const project = db.project.create({
        title: data.title,
        description: data.description ?? "",
        eventId: data.eventId ?? "",
        teamId: data.teamId ?? "",
        isPublic: data.isPublic ?? true,
      });

      await persistDb("project");

      return HttpResponse.json({ data: project });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),

  http.patch(
    `${env.API_URL}/projects/:projectId`,
    async ({ params, request, cookies }) => {
      await networkDelay();

      try {
        const { /*user,*/ error } = requireAuth(cookies);
        if (error) {
          return HttpResponse.json({ message: error }, { status: 401 });
        }

        const projectId = params.projectId as string;
        const data = (await request.json()) as Partial<ProjectBody>;

        const project = db.project.update({
          where: { id: { equals: projectId } },
          data: {
            ...(data.title && { title: data.title }),
            ...(data.description && { description: data.description }),
            ...(data.eventId && { eventId: data.eventId }),
            ...(data.teamId && { teamId: data.teamId }),
            ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
          },
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
    }
  ),

  http.delete(
    `${env.API_URL}/projects/:projectId`,
    async ({ params, cookies }) => {
      await networkDelay();

      try {
        const { /*user,*/ error } = requireAuth(cookies);
        if (error) {
          return HttpResponse.json({ message: error }, { status: 401 });
        }

        const projectId = params.projectId as string;
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
    }
  ),

  // Projects by event
  http.get(
    `${env.API_URL}/projects/by-event/:eventId`,
    async ({ params, cookies, request }) => {
      await networkDelay();

      try {
        const { /*user,*/ error } = requireAuth(cookies);
        if (error) {
          return HttpResponse.json({ message: error }, { status: 401 });
        }

        const eventId = params.eventId as string;
        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page") || 1);

        const total = db.project.count({
          where: { eventId: { equals: eventId } },
        });
        const totalPages = Math.ceil(total / 10);

        const projects = db.project
          .findMany({
            where: { eventId: { equals: eventId } },
            take: 10,
            skip: 10 * (page - 1),
          })
          .map((project) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            eventId: project.eventId,
            teamId: project.teamId,
            teamMembers: project.teamMembers,
            isPublic: project.isPublic,
            createdAt: project.createdAt,
            submittedAt: project.submittedAt,
            approvedAt: project.approvedAt,
          }));

        return HttpResponse.json({
          data: projects,
          meta: { page, total, totalPages },
        });
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || "Server Error" },
          { status: 500 }
        );
      }
    }
  ),
];
