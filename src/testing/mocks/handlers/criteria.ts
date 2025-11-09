import { HttpResponse, http } from "msw";

import { env } from "@/config/env";

import { db, persistDb } from "../db";
import {
  requireAuth,
  networkDelay,
} from "../utils";

type CriteriaBody = {
  name: string;
  description: string;
  weight: number;
};

export const criteriaHandlers = [
  http.get(`${env.API_URL}/criteria`, async ({ cookies, request }) => {
    await networkDelay();
    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }
      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page") || 1);
      const total = db.evaluationCriteria.count();

      const totalPages = Math.ceil(total / 10);
      const criteria = db.evaluationCriteria
        .findMany({
          take: 10,
          skip: (page - 1) * 10,
        })
        .map((evaluationCriteria) => {
          return {
            id: evaluationCriteria.id,
            name: evaluationCriteria.name,
            description: evaluationCriteria.description,
            weight: evaluationCriteria.weight,
          };
        });

      return HttpResponse.json({
        data: criteria,
        meta: {
          total,
          page,
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

  http.get(`${env.API_URL}/criteria/:id`, async ({ params, cookies }) => {
    await networkDelay();
    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const criteriaId = params.id as string;
      const criteria = db.evaluationCriteria.findFirst({
        where: {
          id: {
            equals: criteriaId,
          },
        },
      });

      if (!criteria) {
        return HttpResponse.json(
          { message: "Criteria not found" },
          { status: 404 }
        );
      }

      return HttpResponse.json({
        data: {
          id: criteria.id,
          name: criteria.name,
          description: criteria.description,
          weight: criteria.weight,
        },
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),

  http.post(`${env.API_URL}/criteria`, async ({ cookies, request }) => {
    await networkDelay();
    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }
      const body = (await request.json()) as CriteriaBody;
      const { name, description, weight } = body;

      const created = db.evaluationCriteria.create({
        name,
        description,
        weight,
      });
      await persistDb("evaluationCriteria");
      return HttpResponse.json({ data: created }, { status: 201 });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),

  http.patch(
    `${env.API_URL}/criteria/:id`,
    async ({ cookies, request, params }) => {
      await networkDelay();
      try {
        const { error } = requireAuth(cookies);
        if (error) {
          return HttpResponse.json({ message: error }, { status: 401 });
        }

        const criteriaId = params.id as string;
        const data = (await request.json()) as Partial<CriteriaBody>;

        const criteria = db.evaluationCriteria.update({
          where: {
            id: { equals: criteriaId },
          },
          data: {
            ...(data.name && { name: data.name }),
            ...(data.description && { description: data.description }),
            ...(data.weight && { weight: data.weight }),
          },
        });

        if (!criteria) {
          return HttpResponse.json(
            { message: "Criteria not found" },
            { status: 404 }
          );
        }

        await persistDb("evaluationCriteria");

        return HttpResponse.json({ data: criteria });
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || "Server Error" },
          { status: 500 }
        );
      }
    }
  ),

  http.delete(`${env.API_URL}/criteria/:id`, async ({ params, cookies }) => {
    await networkDelay();
    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const criteriaId = params.id as string;
      const criteria = db.evaluationCriteria.delete({
        where: {
          id: {
            equals: criteriaId,
          },
        },
      });

      if (!criteria) {
        return HttpResponse.json(
          { message: "Criteria not found" },
          { status: 404 }
        );
      }

      await persistDb("evaluationCriteria");

      return HttpResponse.json({ data: criteria });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),
];
