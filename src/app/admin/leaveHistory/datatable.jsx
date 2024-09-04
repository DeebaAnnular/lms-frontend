"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { RiArrowUpDownFill, RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";

export function DataTable({ data, column }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    // Function to format leave types
    const formatLeaveType = (leaveType) => {
        switch (leaveType) {
            case 'sick_leave':
                return 'Sick Leave';
            case 'earned_leave':
                return 'Earned Leave';
            case 'optional_leave':
                return 'Optional Holiday';
            default:
                return leaveType;
        }
    };

    // Function to handle sorting
    const handleSort = (colKey) => {
        let direction = 'ascending';
        if (sortConfig.key === colKey) {
            direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        }
        setSortConfig({ key: colKey, direction });
    };

    // Function to check if a column is a date column
    const isDateColumn = (colKey) => {
        return colKey === 'from_date' || colKey === 'to_date';
    };

    // Function to parse date string to Date object
    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // month is 0-indexed in JavaScript Date
    };

    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (isDateColumn(sortConfig.key)) {
                // Convert to Date objects for comparison if the column is a date
                const dateA = parseDate(aValue);
                const dateB = parseDate(bValue);

                if (dateA < dateB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (dateA > dateB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            } else {
                // Regular comparison for non-date columns
                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            }
        });
    }, [data, sortConfig]);

    // Function to render the appropriate sort icon
    const renderSortIcon = (colKey) => {
        if (sortConfig.key === colKey) {
            return sortConfig.direction === 'ascending' ? 
                <RiArrowUpSFill className="inline-block ml-1 text-[16px]" /> : 
                <RiArrowDownSFill className="inline-block ml-1 text-[16px]" />;
        }
        return <RiArrowUpDownFill className="inline-block ml-1 text-[16px]" />;
    };

    return (
        <div className="w-full">
            <div className="p-2 py-4 relative overflow-x-auto">
                <Table className="w-full ml-4">
                    {/* Table Header */}
                    <TableHeader className="bg-[#f7f7f7] h-[60px] text-[#333843] border-b border-[#ddd]">
                        <TableRow>
                            <TableHead className="text-[16px] font-bold text-[#333843] whitespace-nowrap pl-6 py-3">
                                S.No
                            </TableHead>
                            {column.map((col, index) => (
                                <TableHead
                                    key={index}
                                    className="text-[16px] font-bold text-[#333843] whitespace-nowrap pl-6 py-3 cursor-pointer"
                                    onClick={() => handleSort(col.accessorKey)}
                                >
                                    {col.header}
                                    {isDateColumn(col.accessorKey) && renderSortIcon(col.accessorKey)}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className="text-[#667085]">
                        {sortedData.length ? (
                            sortedData.map((row, rowIndex) => (
                                <TableRow key={rowIndex} className="border-b border-[#ddd]">
                                    {/* Serial Number Column */}
                                    <TableCell className="p-4 pl-7">
                                        {rowIndex + 1}
                                    </TableCell>
                                    
                                    {column.map((col, colIndex) => (
                                        <TableCell
                                            key={colIndex}
                                            className="p-4 pl-7"
                                        >
                                            {/* Conditional rendering for leave type */}
                                            {col.accessorKey === 'leave_type'
                                                ? formatLeaveType(row[col.accessorKey])
                                                : col.accessorKey === 'status'
                                                ? (
                                                    <span className={row[col.accessorKey] === 'approved' ? 'text-green-500' : 'text-red-500'}>
                                                        {row[col.accessorKey]}
                                                    </span>
                                                )
                                                : row[col.accessorKey]
                                            }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={column.length + 1} className="h-24 text-center">
                                    No records found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}