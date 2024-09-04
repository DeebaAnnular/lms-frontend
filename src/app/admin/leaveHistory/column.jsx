"use client";

import { ColumnDef } from "@tanstack/react-table";

// Updated columns for the table
export const column = [
  {
    accessorKey: "emp_name",
    header: "Name",
  },
  {
    accessorKey: "leave_type",
    header: "Leave Type",
  },
  {
    accessorKey: "from_date",
    header: "From Date",
  },
  {
    accessorKey: "to_date",
    header: "To Date",
  },
  {
    accessorKey: "total_days",
    header: "Total Days",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
