
export const JuriesList = () => {
  return <div>Juries List Component</div>;
}

// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import type { Selection } from "@heroui/react";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableColumn,
//   TableRow,
//   TableCell,
// } from "@/components/ui/table";
// import { SearchIcon, ChevronDown } from "lucide-react";
// import {
//   Dropdown,
//   DropdownTrigger,
//   DropdownMenu,
//   DropdownItem,
// } from "@/components/ui/dropdown";
// import { Button } from "@/components/ui/button";
// import { Chip } from "@/components/ui/chip";
// import { useJuries } from "../api/get-juries";
// import { Spinner } from "@/components/ui/spinner";
// import { Pagination } from "@/components/ui/pagination";
// import { Input } from "@/components/ui/input";
// import { useCallback, useMemo, useState } from "react";
// import { useEventsDropdown } from "@/features/events/api/get-events-dropdown";
// import { InviteModal } from "./invite-modal";
// import { EditModal } from "./edit-modal";
// import { DeleteJury } from "./delete-jury";
// import { useAcceptJury } from "../api/accept-jury";
// import { useNotifications } from "@/components/ui/notifications";
// import { useQueryClient } from "@tanstack/react-query";
// import { useProjects } from "@/features/projects/api/get-projects";
// import { Check } from "lucide-react";

// export const JuriesList = () => {
//   const [filterValue, setFilterValue] = useState("");
//   const [statusFilter, setStatusFilter] = useState<Selection>("all");
//   const rowsPerPage = 10;
//   const { addNotification } = useNotifications();
//   const queryClient = useQueryClient();

//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const page = useMemo(() => {
//     const raw = searchParams?.get("page") || "1";
//     const n = Number(raw);
//     return Number.isFinite(n) && n > 0 ? n : 1;
//   }, [searchParams]);

//   const setPageInUrl = useCallback(
//     (n: number) => {
//       const sp = new URLSearchParams(searchParams?.toString());
//       sp.set("page", String(n));
//       router.replace(`?${sp.toString()}`, { scroll: false });
//     },
//     [router, searchParams]
//   );

//   const juriesQuery = useJuries({ page });
//   const eventsQuery = useEventsDropdown();
  
//   // Get all projects for display
//   const projectsQuery = useProjects({ page: 1 });
//   const allProjects = projectsQuery.data?.data || [];

//   const juries = juriesQuery.data?.data ?? [];
//   const meta = juriesQuery.data?.meta;
//   const events = eventsQuery.data?.data ?? [];
//   const isLoading = juriesQuery.isLoading || eventsQuery.isLoading || projectsQuery.isLoading;

//   const eventsMap = useMemo(() => {
//     const m = new Map<string, string>();
//     for (const e of events) {
//       if (e?.id) m.set(String(e.id), e?.name ?? "Unknown Event");
//     }
//     return m;
//   }, [events]);

//   const projectsMap = useMemo(() => {
//     const m = new Map<string, string>();
//     for (const p of allProjects) {
//       if (p?.id) m.set(String(p.id), p?.name ?? "Unknown Project");
//     }
//     return m;
//   }, [allProjects]);

//   const getEventTitle = (eventId: string | number) =>
//     eventsMap.get(String(eventId)) ?? "Unknown Event";

//   const getProjectTitle = (projectId: string | number) =>
//     projectsMap.get(String(projectId)) ?? "Unknown Project";

//   const getEventTitles = (eventIds: string[] = []) => {
//     return eventIds.map((id) => getEventTitle(id)).join(", ") || "—";
//   };

//   const getProjectTitles = (projectIds: string[] = []) => {
//     return projectIds.map((id) => getProjectTitle(id)).join(", ") || "—";
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "accepted":
//         return "success";
//       case "declined":
//         return "danger";
//       case "pending":
//         return "warning";
//       default:
//         return "default";
//     }
//   };

//   const statusOptions = [
//     { name: "accepted", uid: "accepted" },
//     { name: "declined", uid: "declined" },
//     { name: "pending", uid: "pending" },
//   ];

//   const onRowsPerPageChange = useCallback(
//     (e: React.ChangeEvent<HTMLSelectElement>) => {
//       setPageInUrl(1);
//     },
//     [setPageInUrl]
//   );

//   const onSearchChange = useCallback(
//     (value?: string) => {
//       if (value) {
//         setFilterValue(value);
//         setPageInUrl(1);
//       } else {
//         setFilterValue("");
//       }
//     },
//     [setPageInUrl]
//   );

//   const onClear = useCallback(() => {
//     setFilterValue("");
//     setPageInUrl(1);
//   }, [setPageInUrl]);

//   const hasSearchFilter = Boolean(filterValue);

//   // Use server-side pagination metadata when available, otherwise fallback to client-side
//   const pages = meta?.totalPages ?? Math.max(1, Math.ceil(displayJuries.length / rowsPerPage));
//   const totalItems = meta?.total ?? displayJuries.length;
  
//   // Only apply client-side pagination if we have filters, otherwise use server-paginated data directly
//   const displayJuries = hasSearchFilter || statusFilter !== "all" 
//     ? filteredJuries 
//     : juries;

//   const topContent = useMemo(() => {
//     function capitalize(s: string) {
//       return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
//     }
//     return (
//       <div className="flex flex-col gap-4">
//         <div className="flex justify-between gap-3 items-end">
//           <Input
//             isClearable
//             className="w-full sm:max-w-[44%]"
//             placeholder="Buscar por correo, id o título del evento…"
//             startContent={<SearchIcon />}
//             value={filterValue}
//             onClear={onClear}
//             onValueChange={onSearchChange}
//           />
//           <div className="flex gap-3">
//             <Dropdown>
//               <DropdownTrigger className="hidden sm:flex">
//                 <Button
//                   color="secondary"
//                   endContent={<ChevronDown className="text-small" />}
//                   variant="flat"
//                 >
//                   Estado
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu
//                 disallowEmptySelection
//                 aria-label="Filtrar por estado"
//                 closeOnSelect={false}
//                 selectedKeys={statusFilter}
//                 selectionMode="multiple"
//                 onSelectionChange={setStatusFilter}
//               >
//                 {statusOptions.map((s) => (
//                   <DropdownItem key={s.uid} className="capitalize">
//                     {capitalize(s.name)}
//                   </DropdownItem>
//                 ))}
//               </DropdownMenu>
//             </Dropdown>
//             <div>
//               <InviteModal />
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="text-default-400 text-small">
//             {hasSearchFilter || statusFilter !== "all" 
//               ? `${displayJuries.length} resultados (filtrados)` 
//               : `${totalItems} resultados`}
//           </span>
//         </div>
//       </div>
//     );
//   }, [
//     filterValue,
//     statusFilter,
//     onSearchChange,
//     onRowsPerPageChange,
//     hasSearchFilter,
//     totalItems,
//   ]);

//   const bottomContent = useMemo(() => {
//     return (
//       <div className="py-2 px-2 flex justify-between items-center">
//         <Pagination
//           isCompact
//           showControls
//           showShadow
//           color="primary"
//           page={page}
//           total={pages}
//           onChange={(n) => setPageInUrl(n)}
//         />
//         <div className="hidden sm:flex w-[30%] justify-end gap-2">
//           <Button
//             isDisabled={pages === 1}
//             size="sm"
//             variant="flat"
//             onPress={() => setPageInUrl(Math.max(1, page - 1))}
//           >
//             Previous
//           </Button>
//           <Button
//             isDisabled={pages === 1}
//             size="sm"
//             variant="flat"
//             onPress={() => setPageInUrl(Math.min(pages, page + 1))}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     );
//   }, [page, pages, setPageInUrl]);

//   const acceptJuryMutation = useAcceptJury({
//     mutationConfig: {
//       onSuccess: () => {
//         addNotification({ type: "success", title: "Jurado aceptado" });
//         queryClient.invalidateQueries({ queryKey: ["juries"] });
//       },
//     },
//   });

//   const handleAccept = (juryId: string) => {
//     acceptJuryMutation.mutate({ juryId });
//   };

//   const columns = [
//     { key: "email", label: "Correo" },
//     { key: "events", label: "Eventos" },
//     { key: "projects", label: "Proyectos" },
//     { key: "invitationStatus", label: "Estado" },
//     { key: "createdAt", label: "Fecha de invitación" },
//     { key: "actions", label: "Acciones" },
//   ];

//   return (
//     <Table
//       aria-label="Juries List (read-only)"
//       topContent={topContent}
//       topContentPlacement="outside"
//       bottomContent={bottomContent}
//       bottomContentPlacement="outside"
//       classNames={{ wrapper: "max-h-[382px] glass-card" }}
//       selectionMode="none"
//     >
//       <TableHeader columns={columns}>
//         {(column) => (
//           <TableColumn key={column.key} align="center">
//             {column.label}
//           </TableColumn>
//         )}
//       </TableHeader>

//       <TableBody
//         emptyContent={isLoading ? undefined : "Sin resultados"}
//         items={isLoading ? [] : displayJuries}
//       >
//         {isLoading ? (
//           <TableRow key="loading">
//             <TableCell align="center" className="py-10" colSpan={6}>
//               <Spinner size="lg" />
//             </TableCell>
//           </TableRow>
//         ) : (
//           (item: any) => (
//             <TableRow key={item.id}>
//               <TableCell align="center">{item.email}</TableCell>
//               <TableCell align="center">
//                 {getEventTitles(item.eventIds || [])}
//               </TableCell>
//               <TableCell align="center">
//                 {getProjectTitles(item.projectIds || [])}
//               </TableCell>
//               <TableCell align="center">
//                 <Chip
//                   className="w-full capitalize"
//                   color={getStatusColor(item.invitationStatus)}
//                 >
//                   {item.invitationStatus}
//                 </Chip>
//               </TableCell>
//               <TableCell align="center">
//                 {item.createdAt
//                   ? new Date(item.createdAt).toLocaleDateString()
//                   : "—"}
//               </TableCell>
//               <TableCell align="center">
//                 <div className="flex items-center justify-center gap-2">
//                   <EditModal jury={item} />
//                   {item.invitationStatus === "pending" && (
//                     <Button
//                       size="sm"
//                       variant="light"
//                       color="success"
//                       onPress={() => handleAccept(item.id)}
//                       isIconOnly
//                       isLoading={acceptJuryMutation.isPending}
//                     >
//                       <Check size={16} />
//                     </Button>
//                   )}
//                   <DeleteJury id={item.id} />
//                 </div>
//               </TableCell>
//             </TableRow>
//           )
//         )}
//       </TableBody>
//     </Table>
//   );
// };
