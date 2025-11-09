"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select, SelectItem } from "@/components/ui/select";
import { useEventsDropdown } from "@/features/events/api/get-events-dropdown";

export const EventsDropdown = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const eventsQuery = useEventsDropdown();
  const events = eventsQuery.data?.data || [];

  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const ev = searchParams?.get("event");
    if (ev) {
      const ids = ev
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      setSelectedKeys(new Set(ids));
    } else {
      setSelectedKeys(new Set());
    }
  }, [searchParams?.toString()]);

  const handleSelectionChange = (keys: Set<string> | string[]) => {
    const nextSet = keys instanceof Set ? keys : new Set(Array.from(keys));
    setSelectedKeys(nextSet);

    const csv = Array.from(nextSet).join(",");

    const params = new URLSearchParams();
    searchParams?.forEach((v, k) => {
      if (k === "event") return;
      params.set(k, v);
    });

    if (csv) params.set("event", csv);
    else params.delete("event");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="w-full max-w-xs">
      <Select
        label="Seleccionar eventos"
        placeholder="Selecciona uno o más eventos"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => handleSelectionChange(keys as Set<string>)}
        isLoading={eventsQuery.isLoading}
      >
        {events.length > 0 ? (
          events.map((event) => (
            <SelectItem key={event.id}>{event.title}</SelectItem>
          ))
        ) : (
          <SelectItem key="no-events" isDisabled>
            No hay eventos
          </SelectItem>
        )}
      </Select>
    </div>
  );
};
