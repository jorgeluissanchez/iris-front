'use client';

import { useUser } from '@/lib/auth';
import { EvaluationProject } from '@/features/evaluations/components/get-evaluation-project';
import '@/features/landing/index.css';

export const StudentDashboard = () => {
    const user = useUser();

    return (
        <div className='dashboard-page space-y-4 md:space-y-6'>
            <div className="space-y-1 md:space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold">
                    Welcome back, {`${user.data?.firstName} ${user.data?.lastName}`}
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                    View your project evaluation results
                </p>
            </div>
            <div className="w-full overflow-x-auto">
                <EvaluationProject projectId={user.data?.teamId ?? ''} />
            </div>
        </div>
    );
}