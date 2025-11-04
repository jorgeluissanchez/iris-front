'use client';

import { useUser } from '@/lib/auth';
import { EvaluationProject } from '@/features/evaluations/components/get-evaluation-project';

export const StudentDashboard = () => {
    const user = useUser();

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