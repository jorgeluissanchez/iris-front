'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';

import { Link } from '@/components/ui/link';
import { Spinner } from '@/components/ui/spinner';
import { DataTable } from '@/components/data-table';
import { Pagination } from '@/components/ui/pagination';
import { paths } from '@/config/paths';
import { formatDate } from '@/utils/format';

import { getDiscussionQueryOptions } from '../api/get-discussion';
import { useDiscussions } from '../api/get-discussions';

import { DeleteDiscussion } from './delete-discussion';

export type DiscussionsListProps = {
  onDiscussionPrefetch?: (id: string) => void;
};

export const DiscussionsList = ({
  onDiscussionPrefetch,
}: DiscussionsListProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams?.get('page') ? Number(searchParams.get('page')) : 1;

  const discussionsQuery = useDiscussions({
    page: page,
  });
  const queryClient = useQueryClient();

  if (discussionsQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const discussions = discussionsQuery.data?.data;
  const meta = discussionsQuery.data?.meta;

  if (!discussions) return null;

  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}`);
  };

  return (
    <div className="space-y-4">
      <DataTable
        data={discussions}
        columns={[
          {
            key: 'title',
            title: 'Title',
            field: 'title',
          },
          {
            key: 'createdAt',
            title: 'Created At',
            field: 'createdAt',
            Cell({ entry: { createdAt } }) {
              return <span>{formatDate(createdAt)}</span>;
            },
          },
          {
            key: 'view',
            title: '',
            field: 'id',
            Cell({ entry: { id } }) {
              return (
                <Link
                  onMouseEnter={() => {
                    // Prefetch the discussion data when the user hovers over the link
                    queryClient.prefetchQuery(getDiscussionQueryOptions(id));
                    onDiscussionPrefetch?.(id);
                  }}
                  href={paths.app.discussion.getHref(id)}
                >
                  View
                </Link>
              );
            },
          },
          {
            key: 'delete',
            title: '',
            field: 'id',
            Cell({ entry: { id } }) {
              return <DeleteDiscussion id={id} />;
            },
          },
        ]}
      />
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={meta.totalPages}
            page={page}
            onChange={handlePageChange}
            showControls
          />
        </div>
      )}
    </div>
  );
};