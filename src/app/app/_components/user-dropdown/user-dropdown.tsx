import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
  User,
} from "@heroui/react";
import { ChevronUp, ChevronDown, Plus } from "lucide-react";
import { useUser } from "@/lib/auth";

export const UserDropdown = () => {
  const user = useUser();
  return (
    <div className="mb-2 ml-2">
      <Dropdown
        showArrow
        classNames={{
          base: "before:bg-default-200",
          content: "p-0 border-small border-divider bg-background",
        }}
        radius="sm"
      >
        <DropdownTrigger>
          <Button disableRipple variant="ghost">
            <div className="flex flex-row content-center">
              <User
                avatarProps={{
                  size: "sm",
                  src: "",
                }}
                classNames={{
                  name: "text-default-600",
                  description: "text-default-500",
                }}
                description={user.data?.email}
                name={user.data?.firstName + " " + user.data?.lastName}
              />
              <ChevronUp size={20} />
            </div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Custom item styles"
          className="p-3"
          disabledKeys={["profile"]}
          itemClasses={{
            base: [
              "rounded-md",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "data-[hover=true]:bg-default-100",
              "dark:data-[hover=true]:bg-default-50",
              "data-[selectable=true]:focus:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[focus-visible=true]:ring-default-500",
            ],
          }}
        >
          <DropdownSection showDivider aria-label="Profile & Actions">
            <DropdownItem key="dashboard">Dashboard</DropdownItem>
            <DropdownItem key="settings">Settings</DropdownItem>
            <DropdownItem
              key="new_project"
              endContent={<Plus className="text-large" />}
            >
              New Project
            </DropdownItem>
          </DropdownSection>

          <DropdownSection showDivider aria-label="Preferences">
            <DropdownItem key="quick_search" shortcut="⌘K">
              Quick search
            </DropdownItem>
            <DropdownItem
              key="theme"
              isReadOnly
              className="cursor-default"
              endContent={
                <select
                  className="z-10 outline-solid outline-transparent w-16 py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
                  id="theme"
                  name="theme"
                >
                  <option>System</option>
                  <option>Dark</option>
                  <option>Light</option>
                </select>
              }
            >
              Theme
            </DropdownItem>
          </DropdownSection>

          <DropdownSection aria-label="Help & Feedback">
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" className="text-red-300/75">
              Log Out
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
