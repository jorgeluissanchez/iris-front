'use client';

import { useUser } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Badge } from '@heroui/badge';
import { Award } from 'lucide-react';

import { CriteriaEvaluationCard } from '../student/_components/criteria-evaluation-card';
import { JuryFeedbackCard } from '../student/_components/jury-feedback-card';
import { CampusEvaluationCard } from '../student/_components/campus-evaluation-card';
import { EvaluationProject } from '@/features/evaluations/components/get-evaluation-project';

export const StudentDashboard = () => {
    const user = useUser();

    const criteriaData = [
        { title: "Innovation", score: 1.5, maxScore: 1.5 },
        { title: "Technical implementation", score: 1.3, maxScore: 1.5 },
        { title: "Impact & Feasibility", score: 1.5, maxScore: 1.5 },
    ]

    const feedbackData = [
        {
            evaluatorName: "Evaluator 1",
            date: "28/11/2025",
            feedback:
                "Excellent project with strong technical implementation. The AI navigation is innovative and well-executed.",
        },
        {
            evaluatorName: "Evaluator 2",
            date: "28/11/2025",
            feedback:
                "Great work on the user interface and overall concept. The implementation shows good understanding of the problem.",
        },
    ]

    return (
        <div className='space-y-6'>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">
                    Welcome back, {`${user.data?.firstName} ${user.data?.lastName}`}
                </h1>
                <p className="text-muted-foreground">
                    View your project evaluation results
                </p>
            </div>
            <EvaluationProject projectId={user.data?.teamId ?? ''} />
        </div>
    );
}