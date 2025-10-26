'use client';

import { Spinner } from '@/components/ui/spinner';
import { DataTable } from '@/components/data-table';
import { formatDate } from '@/utils/format';

import { useUsers } from '../api/get-users';

import { DeleteUser } from './delete-user';

export const UsersList = () => {
  const usersQuery = useUsers();

  if (usersQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const users = usersQuery.data?.data;

  if (!users) return null;

  return (
    <DataTable
      data={users}
      columns={[
        {
          key: 'firstName',
          title: 'First Name',
          field: 'firstName',
        },
        {
          key: 'lastName',
          title: 'Last Name',
          field: 'lastName',
        },
        {
          key: 'email',
          title: 'Email',
          field: 'email',
        },
        {
          key: 'role',
          title: 'Role',
          field: 'role',
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
          key: 'actions',
          title: '',
          field: 'id',
          Cell({ entry: { id } }) {
            return <DeleteUser id={id} />;
          },
        },
      ]}
    />
  );
};