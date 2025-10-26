import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@heroui/table';

import { ReactNode, ReactElement } from 'react';

type TableColumn<Entry> = {
  key?: string;
  title: string;
  field: keyof Entry | string;
  Cell?({ entry }: { entry: Entry }): ReactElement | ReactNode;
};

export type Column<T> = TableColumn<T>;

export type DataTableProps<Entry extends { id: string | number }> = {
  data: Entry[];
  columns: TableColumn<Entry>[];
};

export function DataTable<Entry extends { id: string | number }>({
  data,
  columns,
}: DataTableProps<Entry>) {
  return (
      <Table>
        <TableHeader>
          {columns.map((column, index) => (
            <TableColumn
              key={column.key || String(column.field) || index}
            >
              {column.title}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent={"No rows to display."}>
          {data.map((item) => (
            <TableRow key={item.id}>
              {columns.map((column, colIndex) => (
                <TableCell key={column.key || String(column.field) || colIndex}>
                  {column.Cell ? (
                    <column.Cell entry={item} />
                  ) : (
                    `${item[column.field as keyof Entry]}`
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
  );
}
