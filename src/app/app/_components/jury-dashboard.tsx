'use client';

import { useUser } from '@/lib/auth';
import { EventsList } from '@/features/events/components/get-events-juror';

export const JuryDashboard = () => {
    const user = useUser();

    return (
        <div className='space-y-6'>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">
                    Welcome back, {`${user.data?.firstName} ${user.data?.lastName}`}
                </h1>
                <p className="text-muted-foreground">
                    View your assigned events and evaluate projects.
                </p>
            </div>
            <EventsList />
        </div>
    );
}