import type { ReactNode } from "react";
import styled from "styled-components";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  minWidth?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
}

export function DataTable<T>({ columns, rows, getRowKey }: DataTableProps<T>) {
  return (
    <TableScroll>
      <Table>
        <thead>
          <tr>
            {columns.map((column) => (
              <Th key={column.key} style={{ minWidth: column.minWidth }}>
                {column.header}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((column) => (
                <Td key={column.key}>{column.render(row)}</Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableScroll>
  );
}

const TableScroll = styled.div`
  overflow: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
`;

const Th = styled.th`
  padding: 0.9rem 1rem;
  color: ${({ theme }) => theme.colors.muted};
  background: rgba(7, 16, 20, 0.62);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0;
  text-align: left;
  text-transform: uppercase;
`;

const Td = styled.td`
  padding: 0.9rem 1rem;
  border-bottom: 1px solid rgba(32, 57, 67, 0.72);
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.86rem;
  vertical-align: top;

  tr:last-child & {
    border-bottom: 0;
  }
`;
