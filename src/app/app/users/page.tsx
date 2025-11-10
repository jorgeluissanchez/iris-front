import { ContentLayout } from '@/components/layouts/content-layout';

import { AdminGuard } from './_components/admin-guard';
import { Users } from './_components/users';
import '@/features/landing/index.css';

export const metadata = {
  title: 'Users',
  description: 'Users',
};

const UsersPage = () => {
  return (
    <ContentLayout title="Users">
      <AdminGuard>
        <Users />
      </AdminGuard>
    </ContentLayout>
  );
};

export default UsersPage;
