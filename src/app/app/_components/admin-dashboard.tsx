'use client';

import { useUser } from '@/lib/auth';
import { Calendar, Folder, Users, FileCheck } from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/card';
import { useDashboardStats } from '@/features/dashboard/api/get-dashboard-stats';

export const AdminDashboard = () => {
  const user = useUser();
  const { data: stats, isLoading } = useDashboardStats();

  // Valores por defecto mientras se carga la información
  const defaultStats = {
    activeEvents: 0,
    totalProjects: 0,
    juryMembers: 0,
    evaluations: 0,
  };

  const displayStats = stats ?? defaultStats;

  const statsCards = [
    {
      title: 'Active events',
      value: isLoading ? '...' : displayStats.activeEvents,
      description: 'Currently running',
      icon: Calendar,
      iconColor: 'text-blue-500',
    },
    {
      title: 'Total projects',
      value: isLoading ? '...' : displayStats.totalProjects,
      description: 'Across all events',
      icon: Folder,
      iconColor: 'text-green-500',
    },
    {
      title: 'Jury members',
      value: isLoading ? '...' : displayStats.juryMembers,
      description: 'Active evaluators',
      icon: Users,
      iconColor: 'text-purple-500',
    },
    {
      title: 'Evaluations',
      value: isLoading ? '...' : displayStats.evaluations,
      description: 'Completed',
      icon: FileCheck,
      iconColor: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome back, {`${user.data?.firstName} ${user.data?.lastName}`}
        </h1>
        <p className="text-muted-foreground">
          Manage events, projects, and evaluations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between w-full">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-default-500">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <p className="text-xs text-default-400">
                {stat.description}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
