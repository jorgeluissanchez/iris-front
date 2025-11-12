'use client';

import { useUser } from '@/lib/auth';
import { EventsList } from '@/features/events/components/get-events-juror';
import { ProjectListView } from '@/features/jury/components/project-list-view';
import '@/features/landing/index.css';

type JuryDashboardProps = {
    eventId?: string;
};

export const JuryDashboard = ({ eventId }: JuryDashboardProps = {}) => {
    const user = useUser();

    if (eventId) {
        return (
            <div className='dashboard-page space-y-4 md:space-y-6'>
                <div className="space-y-1 md:space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Welcome back, {`${user.data?.firstName} ${user.data?.lastName}`}
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground">
                        View and evaluate projects for this event
                    </p>
                </div>
                <div className="w-full overflow-x-auto">
                    <ProjectListView eventId={eventId} />
                </div>
            </div>
        );
    }
}