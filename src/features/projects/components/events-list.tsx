import { useQuery } from "@tanstack/react-query";
import { getSelectEvents } from "@/features/events/api/get-events";
import { useMemo, useState } from "react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@/components/ui/dropdown/dropdown";
import { Button } from "@/components/ui/button";
import { is } from "zod/v4/locales";

export type SelectEventsComponentProps = {
  data: { id: string; title: string }[];
  isLoading: boolean;
  isError: boolean;
};

const SelectEventsComponent = ({
  data,
  isLoading,
  isError,
}: SelectEventsComponentProps) => {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["text"]));

  const selectedValue = useMemo(() => {
    const selectedId = Array.from(selectedKeys)[0];
    const selectedEvent = data.find((event) => event.id === selectedId);
    return selectedEvent ? selectedEvent.title : "Select an event";
  }, [selectedKeys, data]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className="capitalize"
          variant="bordered"
          disabled={isLoading || isError}
        >
          {isLoading
            ? "Loading..."
            : isError
              ? "Error loading events"
              : selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Single selection example"
        selectedKeys={selectedKeys}
        selectionMode="single"
        variant="flat"
        onSelectionChange={setSelectedKeys}
      >
        {data.map((event) => (
          <DropdownItem
            key={event.id}
            className="capitalize"
            textValue={event.title}
          >
            {event.title}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default SelectEventsComponent;
