import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { Jury, Meta } from "@/types/api";

export const getJuries = ({
  page,
}: {
  page: number;
}): Promise<{ data: Jury[]; meta: Meta }> => {
  return api.get(`/juries`, { params: { page } });
};

export const getJuriesQueryOptions = ({ page = 1 }: { page?: number }) => {
  return queryOptions({
    queryKey: ["juries", page],
    queryFn: () => getJuries({ page }),
  });
};

type UseJuriesOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getJuriesQueryOptions>;
};

export const useJuries = ({ queryConfig, page }: UseJuriesOptions = {}) => {
  return useQuery({
    ...getJuriesQueryOptions({ page }),
    ...queryConfig,
  });
};
