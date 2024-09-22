"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { getallemp } from "../../../../actions";

export function DataTable({ data, column }) {
    const [tableData, setTableData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const empData = await getallemp();
                const formattedEmpData = empData.map(emp => ({
                    emp_name: emp.emp_name,
                    asset_no: emp.asset_no,
                    asset_status: emp.asset_status
                }));
                setEmployeeData(formattedEmpData);
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        if (data && data.length > 0 && employeeData.length > 0) {
            console.log("Input data:", data);
            console.log("Employee data for matching:", employeeData);
            const updatedData = data.map(item => {
                console.log("Processing item:", item);
                const matchingEmp = employeeData.find(emp => emp.asset_no === item.asset_no);
                console.log("Matching employee:", matchingEmp);
                const updatedItem = {
                    ...item,
                    emp_name: matchingEmp && matchingEmp.asset_status === 1 ? matchingEmp.emp_name : item.emp_name || '',
                    asset_status: matchingEmp ? matchingEmp.asset_status : item.asset_status
                };
                console.log("Updated item:", updatedItem);
                return updatedItem;
            });
            console.log("Final updated data:", updatedData);
            setTableData(updatedData);
            
            const nameList = updatedData.map(item => item.emp_name).filter(name => name !== '');
            console.log("Names to be displayed in the table:", nameList);
        } else {
            console.log("Data or employeeData is empty:", { dataLength: data?.length, employeeDataLength: employeeData.length });
        }
    }, [data, employeeData]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="w-full">
            <div className="p-2 py-4 relative overflow-x-auto">
                <Table className="w-full ml-4">
                    <TableHeader className="bg-[#f7f7f7] h-[60px] text-[#333843] border-b border-[#ddd]">
                        <TableRow>
                            <TableHead className="text-[13px] font-bold text-[#333843] whitespace-nowrap pl-6 py-3">
                                S.No
                            </TableHead>
                            {column.map((col, index) => (
                                <TableHead
                                    key={index}
                                    className={`text-[13px] font-bold text-[#333843] whitespace-nowrap pl-6 py-3 ${col.accessorKey === 'emp_name' ? 'max-w-[200px]' : ''}`}
                                >
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-[#667085]">
                        {tableData.length ? (
                            tableData.map((row, rowIndex) => (
                                <TableRow key={rowIndex} className="border-b border-[#ddd] text-[12px]">
                                    <TableCell className="p-4 pl-6">
                                        {rowIndex + 1}
                                    </TableCell>
                                    {column.map((col, colIndex) => (
                                        <TableCell
                                            key={colIndex}
                                            className={`p-2 pl-7 ${col.accessorKey === 'emp_name' ? 'p-2 pl-4' : ''}`}
                                        >
                                            {col.accessorKey === 'service_indate' || col.accessorKey === 'service_outdate'
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