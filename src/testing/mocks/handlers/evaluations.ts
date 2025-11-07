import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { db, persistDb } from '../db';
import {
  requireAuth,
  // requireAdmin,
  networkDelay,
} from '../utils';

type EvaluationScore = {
  criterion: string;
  score: number;
};

type EvaluationBody = {
  memberUserId?: string;
  projectId?: string;
  comments?: string;
  scores: EvaluationScore[];
};

export const evaluationsHandlers = [
  http.post(`${env.API_URL}/evaluations`, async ({ request, cookies }) => {
    await networkDelay();
    try {
      const { user, error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const body = (await request.json()) as EvaluationBody;

      if (!Array.isArray(body.scores) || body.scores.length === 0) {
        return HttpResponse.json({ message: 'Invalid payload: scores required' }, { status: 400 });
      }

      const memberUserId = body.memberUserId ?? user?.id ?? '';

      const grade = body.scores.reduce((s, d) => s + (d.score ?? 0), 0);

      const evaluation = db.evaluation.create({
        memberUserId,
        projectId: body.projectId ?? '',
        grade,
        comments: body.comments ?? '',
        scores: body.scores,
      });

      // create details
      body.scores.forEach((d) => {
        db.evaluationDetail.create({
          evaluationId: evaluation.id,
          criterion: d.criterion,
          score: d.score,
        });
      });

      await persistDb('evaluation');
      await persistDb('evaluationDetail');

      const details = db.evaluationDetail.findMany({
        where: { evaluationId: { equals: evaluation.id } },
      });

      return HttpResponse.json({ data: { ...evaluation, details } });
    } catch (err: any) {
      return HttpResponse.json({ message: err?.message || 'Server Error' }, { status: 500 });
    }
  }),

  http.get(`${env.API_URL}/evaluations`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const url = new URL(request.url);
      const projectId = url.searchParams.get('projectId');

      if (!projectId) {
        return HttpResponse.json(
          { message: 'projectId query parameter is required' },
          { status: 400 }
        );
      }

      // Buscar evaluaciones por projectId
      const evaluations = db.evaluation.findMany({
        where: { projectId: { equals: projectId } },
      });

      // Mapear con detalles y calcular promedio
      const result = evaluations.map((evaluation) => {
        const details = db.evaluationDetail.findMany({
          where: { evaluationId: { equals: evaluation.id } },
        });

        const scores = details.map((d) => ({
          criterion: d.criterion,
          score: d.score,
        }));

        const average =
          scores.length > 0
            ? scores.reduce((sum, s) => sum + (s.score ?? 0), 0) / scores.length
            : 0;

        return { ...evaluation, details, scores, average };
      });

      return HttpResponse.json({ data: result });
    } catch (err: any) {
      return HttpResponse.json(
        { message: err?.message || 'Server Error' },
        { status: 500 }
      );
    }
  }),
];