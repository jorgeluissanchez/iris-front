"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardBody } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { useCriteria } from "../api/get-criteria";
import { Chip } from "@heroui/chip";
import { UpdateCriteria } from "./update-criteria";
import { DeleteCriteria } from "./delete-criteria";

export const CriteriaList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams?.get("page") ? Number(searchParams.get("page")) : 1;

  const criteriaQuery = useCriteria({ page });

  if (criteriaQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const criteria = criteriaQuery.data?.data;
  const meta = criteriaQuery.data?.meta;

  if (!criteria) return null;

  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {criteria.map((criterion) => (
          <Card shadow="sm" key={criterion.id}>
            <CardBody className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold">{criterion.name}</h3>
                  <Chip
                    size="sm"
                    color="primary"
                    variant="flat"
                  >
                    {(criterion.weight * 100).toFixed(0)}%
                  </Chip>
                </div>
                <p className="text-sm text-default-500">{criterion.description}</p>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-default-400">
                  Weight: <span className="font-medium text-default-700">{criterion.weight}</span>
                </div>
                {criterion.createdAt && (
                  <div className="text-sm text-default-400">
                    Created:{" "}
                    <span className="font-medium text-default-700">
                      {new Date(criterion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-around pt-2">
                <UpdateCriteria criterionId={criterion.id} />
                <DeleteCriteria criterionId={criterion.id} />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center mt-6">
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

