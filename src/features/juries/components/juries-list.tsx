"use client";

import { useSearchParams, useRouter } from "next/navigation";
import type { Selection } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { SearchIcon, ChevronDown } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { useJuries } from "../api/get-juries";
import { Spinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useCallback, useMemo, useState } from "react";
import { useEventsDropdown } from "@/features/events/api/get-events-dropdown";
import { InviteModal } from "./invite-modal";

export const JuriesList = () => {
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const rowsPerPage = 10;

  const searchParams = useSearchParams();
  const router = useRouter();

  const page = useMemo(() => {
    const raw = searchParams?.get("page") || "1";
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [searchParams]);

  const setPageInUrl = useCallback(
    (n: number) => {
      const sp = new URLSearchParams(searchParams?.toString());
      sp.set("page", String(n));
      router.replace(`?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const juriesQuery = useJuries({ page });
  const eventsQuery = useEventsDropdown();

  const juries = juriesQuery.data?.data ?? [];
  const meta = juriesQuery.data?.meta;
  const events = eventsQuery.data?.data ?? [];
  const isLoading = juriesQuery.isLoading || eventsQuery.isLoading;

  const eventsMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const e of events) {
      if (e?.id) m.set(String(e.id), e?.title ?? "Unknown Event");
    }
    return m;
  }, [events]);

  const getEventTitle = (eventId: string | number) =>
    eventsMap.get(String(eventId)) ?? "Unknown Event";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "success";
      case "declined":
        return "danger";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const statusOptions = [
    { name: "accepted", uid: "accepted" },
    { name: "declined", uid: "declined" },
    { name: "pending", uid: "pending" },
  ];

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPageInUrl(1);
    },
    [setPageInUrl]
  );

  const onSearchChange = useCallback(
    (value?: string) => {
      if (value) {
        setFilterValue(value);
        setPageInUrl(1);
      } else {
        setFilterValue("");
      }
    },
    [setPageInUrl]
  );

  const onClear = useCallback(() => {
    setFilterValue("");
    setPageInUrl(1);
  }, [setPageInUrl]);

  const hasSearchFilter = Boolean(filterValue);

  const filteredJuries = useMemo(() => {
    const q = filterValue.trim().toLowerCase();
    const selected =
      statusFilter === "all"
        ? null
        : new Set(Array.from(statusFilter) as string[]);
    return juries.filter((j) => {
      const title = getEventTitle(j.eventId ?? "");
      const matchSearch =
        !q ||
        j.email?.toLowerCase().includes(q) ||
        String(j.eventId ?? "")
          .toLowerCase()
          .includes(q) ||
        title.toLowerCase().includes(q);
      const st = (j.invitationStatus ?? "").toLowerCase();
      const matchStatus = !selected || selected.has(st);
      return matchSearch && matchStatus;
    });
  }, [juries, filterValue, statusFilter, eventsMap]);

  // Use server-side pagination metadata when available, otherwise fallback to client-side
  const pages = meta?.totalPages ?? Math.max(1, Math.ceil(filteredJuries.length / rowsPerPage));
  const totalItems = meta?.total ?? filteredJuries.length;
  
  // Only apply client-side pagination if we have filters, otherwise use server-paginated data directly
  const displayJuries = hasSearchFilter || statusFilter !== "all" 
    ? filteredJuries 
    : juries;

  const topContent = useMemo(() => {
    function capitalize(s: string) {
      return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
    }
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por correo, id o título del evento…"
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  color="secondary"
                  endContent={<ChevronDown className="text-small" />}
                  variant="flat"
                >
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filtrar por estado"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((s) => (
                  <DropdownItem key={s.uid} className="capitalize">
                    {capitalize(s.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <div>
              <InviteModal />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {hasSearchFilter || statusFilter !== "all" 
              ? `${filteredJuries.length} resultados (filtrados)` 
              : `${totalItems} resultados`}
          </span>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    onSearchChange,
    onRowsPerPageChange,
    hasSearchFilter,
    totalItems,
    filteredJuries.length,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={(n) => setPageInUrl(n)}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={() => setPageInUrl(Math.max(1, page - 1))}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={() => setPageInUrl(Math.min(pages, page + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [page, pages, setPageInUrl]);

  const columns = [
    { key: "email", label: "Correo" },
    { key: "event", label: "Evento" },
    { key: "invitationStatus", label: "Estado" },
    { key: "createdAt", label: "Fecha de invitación" },
  ];

  return (
    <Table
      aria-label="Juries List (read-only)"
      topContent={topContent}
      topContentPlacement="outside"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{ wrapper: "max-h-[382px] glass-card" }}
      selectionMode="none"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} align="center">
            {column.label}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody
        emptyContent={isLoading ? undefined : "Sin resultados"}
        items={isLoading ? [] : displayJuries}
      >
        {isLoading ? (
          <TableRow key="loading">
            <TableCell align="center" className="py-10" colSpan={4}>
              <Spinner size="lg" />
            </TableCell>
          </TableRow>
        ) : (
          (item: any) => (
            <TableRow key={item.id}>
              <TableCell align="center">{item.email}</TableCell>
              <TableCell align="center">
                {getEventTitle(item.eventId)}
              </TableCell>
              <TableCell align="center">
                <Chip
                  className="w-full capitalize"
                  color={getStatusColor(item.invitationStatus)}
                >
                  {item.invitationStatus}
                </Chip>
              </TableCell>
              <TableCell align="center">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "—"}
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
};
