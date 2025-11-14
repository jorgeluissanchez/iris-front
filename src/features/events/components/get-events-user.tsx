"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Calendar, GraduationCap, Scale } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@heroui/button";
import { Chip } from "@/components/ui/chip";

import { useEvents } from "../api/get-events";

export const GetEventsUser = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const page = searchParams?.get("page") ? Number(searchParams.get("page")) : 1;

    const eventsQuery = useEvents({
        page: page,
    });

    if (eventsQuery.isLoading) {
        return (
            <div className="flex h-48 w-full items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    const events = eventsQuery.data?.data;
    const meta = eventsQuery.data?.meta;

    if (!events) return null;

    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <p className="text-lg text-default-500">No events found</p>
                <p className="text-sm text-default-400">You are not enrolled in any events yet</p>
            </div>
        );
    }

    const handlePageChange = (newPage: number) => {
        router.push(`?page=${newPage}`);
    };

    const getRoleIcon = (role?: "STUDENT" | "JURY") => {
        if (role === "JURY") return <Scale className="h-4 w-4" />;
        if (role === "STUDENT") return <GraduationCap className="h-4 w-4" />;
        return null;
    };

    const getRoleColor = (role?: "STUDENT" | "JURY") => {
        if (role === "JURY") return "warning";
        if (role === "STUDENT") return "primary";
        return "default";
    };

    const getRoleLabel = (role?: "STUDENT" | "JURY") => {
        if (role === "JURY") return "Juror";
        if (role === "STUDENT") return "Student";
        return "Unknown";
    };

    return (
        <div className="space-y-4">
            <div className="grid p-8 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                    <Card shadow="sm" key={event.id} className="glass-card">
                        <CardBody className="p-6 space-y-4 flex flex-col">
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-xl font-semibold flex-1">{event.title}</h3>
                                    {event.userEventRole && (
                                        <Chip
                                            color={getRoleColor(event.userEventRole)}
                                            variant="flat"
                                            size="sm"
                                            startContent={getRoleIcon(event.userEventRole)}
                                        >
                                            {getRoleLabel(event.userEventRole)}
                                        </Chip>
                                    )}
                                </div>
                                <p className="text-sm text-default-500">{event.description}</p>
                            </div>

                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-default-400" />
                                        <span className="text-default-400">Start:</span>
                                        <span>{event.startDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-default-400" />
                                        <span className="text-default-400">End:</span>
                                        <span>{event.endDate}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-1">
                                    <span className="text-sm text-default-400">Evaluations:</span>
                                    <span
                                        className={`text-sm font-medium ${
                                            event.evaluationsStatus === "open"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {event.evaluationsStatus === "open" ? "Open" : "Closed"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-auto pt-2">
                                <Button
                                    onPress={() => router.push(`/app/events/${event.id}/dashboard`)}
                                    color="primary"
                                    className="w-full transition-transform hover:scale-[1.01]"
                                >
                                    {event.userEventRole === "JURY" ? "View Projects" : "View My Project"}
                                </Button>
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
