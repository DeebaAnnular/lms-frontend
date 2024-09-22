"use client";

import { ColumnDef } from "@tanstack/react-table";

// Updated columns for the table
export const column = [
  {
    accessorKey: "emp_id",
    header: "Employee ID",
  },
  {
    accessorKey: "emp_name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "access_card_number",
    header: "Access Card No",
  },
  {
    accessorKey: "issue_date",
    header: "Issue Date",
  },
  {
    accessorKey: "return_date",
    header: "Returned Date",
  },
  {
    accessorKey: "comments",
    header: "Comments",
  },
];
  

