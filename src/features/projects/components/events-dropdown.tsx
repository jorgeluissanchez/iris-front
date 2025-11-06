"use client";

import { useRouter } from "next/navigation";

import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from "@/components/ui/dropdown/dropdown";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEventsDropdown } from "@/features/events/api/get-events-dropdown";

export const EventsDropdown = () => {
	const router = useRouter();

	const eventsQuery = useEventsDropdown();

	const events = eventsQuery.data?.data;

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button variant="bordered" disabled={eventsQuery.isLoading} startContent={eventsQuery.isLoading && <Spinner className="w-2 h-2" />}>
					Seleccionar Evento
				</Button>
			</DropdownTrigger>
			<DropdownMenu>{
				events && events.length > 0
					? events.map((event) => (
						<DropdownItem
							key={event.id}
							textValue={event.title}
							onClick={() => {
								router.push(`?event=${event.id}`);
							}}
						>
							{event.title}
						</DropdownItem>
					))
					: <DropdownItem key="no-events">No hay eventos</DropdownItem>
			}</DropdownMenu>
		</Dropdown>
	);
};

