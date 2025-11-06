'use client';

import { ContentLayout } from '@/components/layouts/content-layout';
import { CreateEvent } from '@/features/events/components/create-event';
import { EventsList } from '@/features/events/components/events-list';

export const Events = () => {

  return (
    <ContentLayout title="Events">
      <div className="flex justify-end">
        <CreateEvent />
      </div>
      <div className="mt-4">
        <EventsList />
      </div>
    </ContentLayout>
  );
};
