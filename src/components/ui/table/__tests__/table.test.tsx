import { render, screen } from '@testing-library/react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '../table';

const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

describe('Table Components', () => {
  describe('Table', () => {
    it('renders table with basic structure', () => {
      render(
        <Table aria-label="Test table">
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Email</TableColumn>
          </TableHeader>
          <TableBody>
            {mockData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );

      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('renders striped table when isStriped is true', () => {
      render(
        <Table aria-label="Striped table" isStriped>
          <TableHeader>
            <TableColumn>Name</TableColumn>
          </TableHeader>
          <TableBody>
            {mockData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );

      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('renders table without wrapper when removeWrapper is true', () => {
      render(
        <Table aria-label="No wrapper table" removeWrapper>
          <TableHeader>
            <TableColumn>Name</TableColumn>
          </TableHeader>
          <TableBody>
            {mockData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );

      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('renders table without header when hideHeader is true', () => {
      render(
        <Table aria-label="No header table" hideHeader>
          <TableHeader>
            <TableColumn>Name</TableColumn>
          </TableHeader>
          <TableBody>
            {mockData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );

      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  describe('Table with selection', () => {
    it('renders table with single selection', () => {
      render(
        <Table aria-label="Single selection table" selectionMode="single">
          <TableHeader>
            <TableColumn>Name</TableColumn>
          </TableHeader>
          <TableBody>
            {mockData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );

      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('renders table with multiple selection', () => {
      render(
        <Table aria-label="Multiple selection table" selectionMode="multiple">
          <TableHeader>
            <TableColumn>Name</TableColumn>
          </TableHeader>
          <TableBody>
            {mockData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );

      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  describe('Table with empty state', () => {
    it('renders empty state when no data', () => {
      render(
        <Table aria-label="Empty table">
          <TableHeader>
            <TableColumn>Name</TableColumn>
          </TableHeader>
          <TableBody items={[]} emptyContent="No data available">
            {(user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      );

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  describe('Table with loading state', () => {
    it('renders loading state', () => {
      render(
        <Table aria-label="Loading table">
          <TableHeader>
            <TableColumn>Name</TableColumn>
          </TableHeader>
          <TableBody items={[]} isLoading>
            {(user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      );

      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });
});
