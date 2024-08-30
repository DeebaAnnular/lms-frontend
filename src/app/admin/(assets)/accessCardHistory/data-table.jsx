"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";

export function DataTable({ data, column }) {
    const tableData = data || [];

    // Function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        
        // Extract day, month, and year
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
    
        // Return formatted date as dd-mm-yyyy
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="w-full">
            <div className="p-2 py-4 relative overflow-x-auto">
                <Table className="w-full ml-4">
                    {/* Table Header */}
                    <TableHeader className="bg-[#f7f7f7] h-[60px] text-[#333843] border-b border-[#ddd]">
                        <TableRow>
                            {/* Serial Number Header */}
                            <TableHead className="text-[16px] font-bold text-[#333843] whitespace-nowrap pl-6 py-3">
                                S.No
                            </TableHead>

                            {column.map((col, index) => (
                                <TableHead
                                    key={index}
                                    className={`text-[16px] font-bold text-[#333843] whitespace-nowrap pl-6 py-3 ${col.accessorKey === 'name' ? 'max-w-[200px]' : ''}`}
                                >
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className="text-[#667085]">
                        {tableData.length ? (
                            tableData.map((row, rowIndex) => (
                                <TableRow key={rowIndex} className="border-b border-[#ddd]">
                                    {/* Serial Number Cell */}
                                    <TableCell className="p-4 pl-6">
                                        {rowIndex + 1}
                                    </TableCell>

                                    {column.map((col, colIndex) => (
                                        <TableCell
                                            key={colIndex}
                                            className={`p-4 pl-7 ${col.accessorKey === 'emp_name' ? 'p-2 pl-4' : ''}`}
                                        >
                                    
                                            {col.accessorKey === 'issue_date' || col.accessorKey === 'return_date'
                                                ? formatDate(row[col.accessorKey])
                                                : row[col.accessorKey]} 
                                               
                                              
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
