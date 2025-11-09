import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

export interface DashboardStats {
  activeEvents: number;
  totalProjects: number;
  juryMembers: number;
  evaluations: number;
}

export const getDashboardStats = (): Promise<DashboardStats> => {
  return api.get(`/dashboard/stats`);
};

export const getDashboardStatsQueryOptions = () => {
  return queryOptions({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStats(),
  });
};

type UseDashboardStatsOptions = {
  queryConfig?: QueryConfig<typeof getDashboardStatsQueryOptions>;
};

export const useDashboardStats = ({ queryConfig }: UseDashboardStatsOptions = {}) => {
  return useQuery({
    ...getDashboardStatsQueryOptions(),
    ...queryConfig,
  });
};

