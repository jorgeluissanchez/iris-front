import { HttpResponse, http } from "msw";

import { env } from "@/config/env";

import { networkDelay } from "../utils";

import { juriesHandlers } from "./juries";
import { authHandlers } from "./auth";
import { commentsHandlers } from "./comments";
import { coursesHandlers } from "./courses";
import { discussionsHandlers } from "./discussions";
import { eventsHandlers } from "./events";
import { teamsHandlers } from "./teams";
import { usersHandlers } from "./users";
import { projectsHandlers } from "./projects";
import { evaluationsHandlers } from "./evaluations";

export const handlers = [
  ...juriesHandlers,
  ...authHandlers,
  ...commentsHandlers,
  ...coursesHandlers,
  ...discussionsHandlers,
  ...eventsHandlers,
  ...projectsHandlers,
  ...teamsHandlers,
  ...usersHandlers,
  ...evaluationsHandlers,
  http.get(`${env.API_URL}/healthcheck`, async () => {
    await networkDelay();
    return HttpResponse.json({ ok: true });
  }),
];
