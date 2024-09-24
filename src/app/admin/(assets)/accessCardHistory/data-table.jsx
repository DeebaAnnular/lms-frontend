"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  updateAccessCardDetails,
  deleteAccessCard,
  getAllAccessCardDetails ,
} from "../../../../actions/assetApi";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { MdEdit, MdDelete, MdSave, MdCancel } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getallemp } from "../../../../actions";
import AccessModal from "../../../../components/ui/accessModal"; // Fixed the import here

export function DataTable({ data, column }) {
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [accessCardDetails, setAccessCardDetails] = useState([]);


  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

  const handleCloseEmployeeModal = () => {
    setShowEmployeeModal(false);
    setSelectedEmployee(null);
    // refreshTableData();
  };

  const roleOptions = [
    { value: "", label: "Select a role" },
    { value: "consultant", label: "Consultant" },
    { value: "employee", label: "Employee" },
    { value: "intern", label: "Intern" },
    { value: "contractor", label: "Contractor" },
    { value: "visitor", label: "Visitor" },
    { value: "client", label: "Client" },
    { value: "vendor", label: "Vendor" },
  ]; 


  useEffect(() => {
    if (data && data.length > 0) {
      setTableData(data);
    }
    fetchEmployees();
  }, [data]);

  const fetchEmployees = async () => {
    try {
      const empData = await getallemp();
      setEmployees(empData);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };  

  // const refreshTableData = async () => {
  //   try {
  //     const updatedData = await getAllAccessCardDetails();
  //     setTableData(updatedData);
  //     setAccessCardDetails(updatedData);
  //   } catch (error) {
  //     console.error("Failed to refresh table data:", error);
  //     toast.error("Failed to refresh data");
  //   }
  // };



  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }; 

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleEditClick = (row) => {
    setEditingRow(row.access_card_id);
    setEditedData({
      ...row,
      issue_date: formatDateForInput(row.issue_date),
      return_date: formatDateForInput(row.return_date)
    });
  };
  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditedData({});
  };

  const handleInputChange = (e, accessorKey) => {
    setEditedData({ ...editedData, [accessorKey]: e.target.value });
  };

  const handleEmployeeSelect = (e) => {
    const [name, empId] = e.target.value.split(" (");
    setEditedData({
      ...editedData,
      emp_name: name,
      emp_id: empId.slice(0, -1), // Remove the closing parenthesis
    });
  };

  const handleSaveClick = async () => {
    try {
      const { access_card_id, ...updateData } = editedData;

      const employeeHasCard = accessCardDetails.some(
        card => card.emp_id === updateData.emp_id && card.access_card_id !== access_card_id
      );

      if (employeeHasCard) {
        toast.error("Employee already has an access card");
        return;
      }
     

      const response = await updateAccessCardDetails(editingRow, updateData);
      if (response.statusCode === 200) {
        toast.success("Access card updated successfully");
        setTableData((prevData) =>
          prevData.map((row) =>
            row.access_card_id === editingRow ? { ...row, ...editedData } : row
          )
        );
        setEditingRow(null);
        setEditedData({});
      } else {
        toast.error(response.resmessage || "Failed to update access card");
      }
    } catch (error) {
      toast.error("An error occurred while updating the access card");
    }
  };

  const handleDeleteClick = async (accessCardId) => {
    try {
      await deleteAccessCard(accessCardId);
      toast.success("Access card deleted successfully");
      setTableData((prevData) =>
        prevData.filter((row) => row.access_card_id !== accessCardId)
      );
    } catch (error) {
      toast.error("Failed to delete access card");
    }
  };


  const handleReturnAccessCard = async (accessCardId,returnDate) => {
    try {
        // Implement the logic for returning the access card
        // This might involve calling an API endpoint
        // After successful return, update the table data
        setTableData((prevData) =>
          prevData.map((row) =>
            row.access_card_id === accessCardId
              ? { ...row, return_date: returnDate }
              : row
          )
        );
        toast.success("Access card returned successfully");
        handleCloseEmployeeModal();
    } catch (error) {
        toast.error("Failed to return access card");
    }
};

  return (
    <div className="w-full">
      <ToastContainer />
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
                  className={`text-[13px] font-bold text-[#333843] whitespace-nowrap pl-6 py-3 ${
                    col.accessorKey === "name" ? "max-w-[200px]" : ""
                  }`}
                >
                  {col.header}
                </TableHead>
              ))}
              <TableHead className="text-[13px] font-bold text-[#333843] whitespace-nowrap pl-6 py-3">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-[#667085]">
            {tableData && tableData.length ? (
              tableData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="border-b text-[12px] border-[#ddd]"
                >
                  <TableCell className="p-4 pl-6">{rowIndex + 1}</TableCell>
                  {column.map((col, colIndex) => (
                     <TableCell
                     key={colIndex}
                     className={`p-4 pl-7 ${
                       col.accessorKey === "emp_name" ? "p-3 pl-1" : ""
                     }`}
                   >
                     {editingRow === row.access_card_id ? (
                       col.accessorKey === "emp_name" ? (
                         row.card_type === "id card" ? (
                           <select
                             onChange={handleEmployeeSelect}
                             value={`${editedData.emp_name} (${editedData.emp_id})`}
                             className="w-full p-2 border rounded"
                           >
                             <option value="">Select an employee</option>
                             {employees.map((emp) => (
                               <option
                                 key={emp.emp_id}
                                 value={`${emp.emp_name} (${emp.emp_id})`}
                               >
                                 {emp.emp_name} ({emp.emp_id})
                               </option>
                             ))}
                           </select>
                         ) : (
                           <Input
                             value={editedData.emp_name || ""}
                             onChange={(e) => handleInputChange(e, "emp_name")}
                             className="w-full"
                           />
                         )
                       ) : col.accessorKey === "role" ? (
                         <select
                           value={editedData.role || ""}
                           onChange={(e) => handleInputChange(e, "role")}
                           className="w-full p-2 border rounded"
                         >
                           {roleOptions.map((option) => (
                             <option key={option.value} value={option.value}>
                               {option.label}
                             </option>
                           ))}
                         </select>
                       ) : col.accessorKey === "emp_id" ? (
                         row.card_type === "id card" ? (
                           <Input
                             value={editedData[col.accessorKey] || ""}
                             disabled
                             className="w-full bg-gray-100 cursor-not-allowed"
                           />
                         ) : (
                           <Input
                             value={editedData[col.accessorKey] || ""}
                             onChange={(e) => handleInputChange(e, col.accessorKey)}
                             className="w-full"
                           />
                         )
                       ) : col.accessorKey === "issue_date" ? (
                         <Input
                           type="date"
                           value={editedData[col.accessorKey] || ""}
                           onChange={(e) => handleInputChange(e, col.accessorKey)}
                           className="w-full"
                         />
                       ) : col.accessorKey === "return_date" ? (
                         <Input
                           type="date"
                           value={editedData[col.accessorKey] || ""}
                           onChange={(e) => handleInputChange(e, col.accessorKey)}
                           className="w-full"
                           disabled
                         />
                       ) : (
                         <Input
                           value={editedData[col.accessorKey] || ""}
                           onChange={(e) => handleInputChange(e, col.accessorKey)}
                           className="w-full"
                         />
                       )
                     ) : col.accessorKey === "emp_id" ? (
                       <span
                         className="cursor-pointer text-blue-600 hover:underline"
                         onClick={() => handleEmployeeClick(row)}
                       >
                         {row[col.accessorKey] || "-"}
                       </span>
                     ) : col.accessorKey === "issue_date" ||
                       col.accessorKey === "return_date" ? (
                       formatDate(row[col.accessorKey])
                     ) : (
                       row[col.accessorKey] || "-"
                     )}
                   </TableCell>
                   ))}
                  <TableCell className="p-4 pl-6 flex flex-row">
                    {editingRow === row.access_card_id ? (
                      <>
                        <Button
                          onClick={handleSaveClick}
                          className="mr-2 px-2 py-2 text-xs bg-[#134572] text-white"
                        >
                          <MdSave className="mr-1" /> Save
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          className="bg-[#134572] px-2 py-2 text-xs text-white"
                        >
                          <MdCancel className="mr-1" /> Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleEditClick(row)}
                          className="mr-2 border px-2 py-1 text-xs bg-[#134572] text-white"
                        >
                          <MdEdit className="mr-1" /> Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(row.access_card_id)}
                          variant="outline"
                          className="px-2 py-2 text-xs bg-[#134572] text-white"
                        >
                          <MdDelete className="mr-1" /> Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={column.length + 2} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {showEmployeeModal && (
                <AccessModal
                    employee={selectedEmployee}
                    onClose={handleCloseEmployeeModal}
                    onReturn={handleReturnAccessCard}
                />
            )}

      </div>
    </div>
  );
}
