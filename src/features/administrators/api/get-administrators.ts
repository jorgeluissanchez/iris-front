import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { Administrator, Meta } from "@/types/api";

export const getAdministrators = ({
  page,
}: {
  page: number;
}): Promise<{ data: Administrator[]; meta: Meta }> => {
  return api.get(`/administrators`, { params: { page } });
};

export const getAdministratorsQueryOptions = ({ page = 1 }: { page?: number }) => {
  return queryOptions({
    queryKey: ["administrators", page],
    queryFn: () => getAdministrators({ page }),
  });
};

type UseAdministratorsOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getAdministratorsQueryOptions>;
};

export const useAdministrators = ({ queryConfig, page }: UseAdministratorsOptions = {}) => {
  return useQuery({
    ...getAdministratorsQueryOptions({ page }),
    ...queryConfig,
  });
};

