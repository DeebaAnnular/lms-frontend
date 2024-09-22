"use client";

import { ColumnDef } from "@tanstack/react-table";

// Updated columns for the asset maintenance history table
export const column = [
  {
    accessorKey:"emp_name",
    header:"Name",

  },
  {
    accessorKey: "asset_no",
    header: "Asset No",
  },
  {
    accessorKey: "issue_description",
    header: "Issue Description",
  },
  {
    accessorKey: "service_indate",
    header: "Service Initiated",
  },
  {
    accessorKey: "service_outdate",
    header: "Service Completed",
  },
  {
    accessorKey: "service_cost",
    header: "Service Cost",
  },
  {
    accessorKey: "comments",
    header: "Comments",
  },
];
