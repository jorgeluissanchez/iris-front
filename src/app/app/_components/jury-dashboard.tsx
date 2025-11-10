'use client';

import { useUser } from '@/lib/auth';
import { EventsList } from '@/features/events/components/get-events-juror';
import '@/features/landing/index.css';

export const JuryDashboard = () => {
    const user = useUser();

    return (
        <div className='dashboard-page space-y-4 md:space-y-6'>
            <div className="space-y-1 md:space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold">
                    Welcome back, {`${user.data?.firstName} ${user.data?.lastName}`}
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                    View your assigned events and evaluate projects.
                </p>
            </div>
            <div className="w-full overflow-x-auto">
                <EventsList />
            </div>
        </div>
    );
}