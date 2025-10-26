import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button/button';
import { Badge } from '@heroui/badge';
import { Avatar } from '@heroui/avatar';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableColumn, 
  TableRow, 
  TableCell 
} from './table';

const meta: Meta<typeof Table> = {
  component: Table,
  title: 'UI/Table',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    selectionMode: {
      control: { type: 'select' },
      options: ['single', 'multiple', undefined],
    },
    isStriped: {
      control: { type: 'boolean' },
    },
    removeWrapper: {
      control: { type: 'boolean' },
    },
    hideHeader: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

// Sample data
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=john',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'Inactive',
    avatar: 'https://i.pravatar.cc/150?u=jane',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'User',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=bob',
  },
];

export const Default: Story = {
  render: () => (
    <Table aria-label="Users table">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>EMAIL</TableColumn>
        <TableColumn>ROLE</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar src={user.avatar} size="sm" />
                <span className="font-medium">{user.name}</span>
              </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <Badge color={user.status === 'Active' ? 'success' : 'default'}>
                {user.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Button size="sm" variant="light">
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Striped: Story = {
  render: () => (
    <Table aria-label="Striped table" isStriped>
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>EMAIL</TableColumn>
        <TableColumn>ROLE</TableColumn>
        <TableColumn>STATUS</TableColumn>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <Badge color={user.status === 'Active' ? 'success' : 'default'}>
                {user.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithSelection: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());
    
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          Selected: {Array.from(selectedKeys).join(', ')}
        </div>
        <Table
          aria-label="Selection table"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) => setSelectedKeys(keys as Set<string | number>)}
        >
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>ROLE</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <Table aria-label="Empty table">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>EMAIL</TableColumn>
        <TableColumn>ROLE</TableColumn>
      </TableHeader>
      <TableBody items={[]} emptyContent="No users found">
        {(user: any) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  ),
};
