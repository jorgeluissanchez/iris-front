'use client';

import { useUser } from '@/lib/auth';
import { AdminDashboard } from './admin-dashboard';
import { StudentDashboard } from './student-dashboard';
import { JuryDashboard } from './jury-dashboard';

export const DashboardInfo = () => {
  const user = useUser();

  switch (user.data?.role) {
    case 'ADMIN':
      return <AdminDashboard/>;
    case 'STUDENT':
      return <StudentDashboard/>;
    case 'JURY':
      return <JuryDashboard/>;
  }
};
