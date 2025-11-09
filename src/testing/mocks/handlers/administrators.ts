import { HttpResponse, http } from "msw";

import { env } from "@/config/env";
import { db, persistDb } from "../db";
import { requireAuth, networkDelay } from "../utils";

type AdministratorBody = {
  email: string;
};

export const administratorsHandlers = [
  http.get(`${env.API_URL}/administrators`, async ({ cookies, request }) => {
    await networkDelay();

    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page") || 1);

      const total = db.administrator.count();
      const totalPages = Math.ceil(total / 10);

      const administrators = db.administrator
        .findMany({
          take: 10,
          skip: 10 * (page - 1),
        })
        .map((administrator) => ({
          id: administrator.id,
          email: administrator.email,
          invitationStatus: administrator.invitationStatus,
          createdAt: administrator.createdAt,
        }));

      return HttpResponse.json({
        data: administrators,
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

  // Invite a new administrator
  http.post(`${env.API_URL}/administrators`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const data = (await request.json()) as AdministratorBody;

      // Check if administrator already exists
      const existingAdministrator = db.administrator.findFirst({
        where: {
          email: {
            equals: data.email,
          },
        },
      });

      if (existingAdministrator) {
        return HttpResponse.json(
          { message: "Administrator already invited" },
          { status: 400 }
        );
      }

      const administrator = db.administrator.create({
        email: data.email,
        invitationStatus: "pending",
      });

      await persistDb("administrator");

      return HttpResponse.json({ data: administrator });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),

  // Update administrator invitation status
  http.patch(
    `${env.API_URL}/administrators/:administratorId`,
    async ({ params, request, cookies }) => {
      await networkDelay();

      try {
        const { error } = requireAuth(cookies);
        if (error) {
          return HttpResponse.json({ message: error }, { status: 401 });
        }

        const administratorId = params.administratorId as string;
        const data = (await request.json()) as {
          invitationStatus: "pending" | "accepted" | "declined";
        };

        const administrator = db.administrator.update({
          where: {
            id: {
              equals: administratorId,
            },
          },
          data: {
            invitationStatus: data.invitationStatus,
          },
        });

        if (!administrator) {
          return HttpResponse.json(
            { message: "Administrator not found" },
            { status: 404 }
          );
        }

        await persistDb("administrator");

        return HttpResponse.json({ data: administrator });
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || "Server Error" },
          { status: 500 }
        );
      }
    }
  ),

  // Delete an administrator invitation
  http.delete(
    `${env.API_URL}/administrators/:administratorId`,
    async ({ params, cookies }) => {
      await networkDelay();

      try {
        const { error } = requireAuth(cookies);
        if (error) {
          return HttpResponse.json({ message: error }, { status: 401 });
        }

        const administratorId = params.administratorId as string;
        const administrator = db.administrator.delete({
          where: {
            id: {
              equals: administratorId,
            },
          },
        });

        if (!administrator) {
          return HttpResponse.json(
            { message: "Administrator not found" },
            { status: 404 }
          );
        }

        await persistDb("administrator");

        return HttpResponse.json({ data: administrator });
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || "Server Error" },
          { status: 500 }
        );
      }
    }
  ),
];

