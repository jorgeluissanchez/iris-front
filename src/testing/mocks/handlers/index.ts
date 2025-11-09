import { HttpResponse, http } from "msw";

import { env } from "@/config/env";

import { networkDelay } from "../utils";

import { juriesHandlers } from "./juries";
import { administratorsHandlers } from "./administrators";
import { authHandlers } from "./auth";
import { commentsHandlers } from "./comments";
import { coursesHandlers } from "./courses";
import { discussionsHandlers } from "./discussions";
import { eventsHandlers } from "./events";
import { teamsHandlers } from "./teams";
import { criterionPublicHandlers } from "./criterion-public";
import { projectsPublicHandlers } from "./projects-public";
import { coursesPublicHandlers } from "./courses-public";
import { usersHandlers } from "./users";
import { projectsHandlers } from "./projects";
import { evaluationsHandlers } from "./evaluations";
import { criteriaHandlers } from "./criteria";

export const handlers = [
  ...juriesHandlers,
  ...administratorsHandlers,
  ...authHandlers,
  ...commentsHandlers,
  ...coursesHandlers,
  ...discussionsHandlers,
  ...eventsHandlers,
  ...projectsHandlers,
  ...teamsHandlers,
  ...usersHandlers,
  ...projectsPublicHandlers,
  ...coursesPublicHandlers,
  ...evaluationsHandlers,
  ...criterionPublicHandlers,
  ...criteriaHandlers,
  http.get(`${env.API_URL}/healthcheck`, async () => {
    await networkDelay();
    return HttpResponse.json({ ok: true });
  }),
];
