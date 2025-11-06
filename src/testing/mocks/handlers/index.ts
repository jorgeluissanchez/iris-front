import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { networkDelay } from '../utils';

import { authHandlers } from './auth';
import { commentsHandlers } from './comments';
import { discussionsHandlers } from './discussions';
import { eventsHandlers } from './events';
import { teamsHandlers } from './teams';
import { usersHandlers } from './users';
import { projectsHandlers } from './projects';
import { coursesHandlers } from './courses';

export const handlers = [
  ...authHandlers,
  ...commentsHandlers,
  ...discussionsHandlers,
  ...eventsHandlers,
  ...teamsHandlers,
  ...usersHandlers,
  ...projectsHandlers,
  ...coursesHandlers,
  http.get(`${env.API_URL}/healthcheck`, async () => {
    await networkDelay();
    return HttpResponse.json({ ok: true });
  }),
];
