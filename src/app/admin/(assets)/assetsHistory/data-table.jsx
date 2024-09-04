import React, { useState,useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "../../../../components/ui/button";
import { MdEdit, MdDelete, MdSave, MdCancel } from "react-icons/md";
import { Input } from "../../../../components/ui/input";
import { deleteAsset, updateAssetDetails } from '../../../../actions/assetApi';
import  AssetModal  from '../../../../components/ui/assetModal'

export function DataTable({ data, column }) {
    // console.log("data",data);
    const [tableData, setTableData] = useState([]);
    console.log("tabledata",tableData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [editedData, setEditedData] = useState({});

    useEffect(() => {
        if (data && data.length > 0) {
            setTableData(data);
        }
    }, [data]);  

    useEffect(()=>{
        
    })

    const handleAssetIdClick = (asset) => {
        setSelectedAsset({
            asset_id: asset.asset_id,
            asset_no: asset.asset_no,
            asset_type: asset.asset_type,
            asset_status: asset.asset_status,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAsset(null);
    };

    const handleEditClick = (row) => {
        setEditingRow(row.asset_id);
        setEditedData(row);
    };

    const handleCancelEdit = () => {
        setEditingRow(null);
        setEditedData({});
    };

    const handleInputChange = (e, accessorKey) => {
        setEditedData({
            ...editedData,
            [accessorKey]: e.target.value
        });
    };

    const handleSaveClick = async () => {
        try {
            const response = await updateAssetDetails(editingRow, editedData);
            if (response.statusCode === 200) {
                setTableData(prevData =>
                    prevData.map(item =>
                        item.asset_id === editingRow ? { ...item, ...editedData } : item
                    )
                );
                setEditingRow(null);
                setEditedData({});
                toast.success("Asset updated successfully");
            } else {
                toast.error(response.resmessage || "Failed to update asset");
            }
        } catch (error) {
            toast.error("An error occurred while updating the asset");
        }
    };

    const handleDeleteClick = async (assetId) => {
        try {
            await deleteAsset(assetId);
            toast.success("Asset deleted successfully");
            setTableData(prevData => prevData.filter(asset => asset.asset_id !== assetId));
        } catch (error) {
            toast.error("Failed to delete asset");
        }
    };

    return (
        <div className="w-full">
            <ToastContainer />
            <div className="p-2 py-4 relative overflow-x-auto">
                <Table className="w-full ml-4">
                    <TableHeader className="bg-[#f7f7f7] h-[60px] text-[#333843]">
                        <TableRow>
                            <TableHead className="text-[16px] font-bold text-[#333843] whitespace-nowrap pl-4">
                                S.No
                            </TableHead>
                            {column.map((col, index) => (
                                <TableHead key={index} className="text-[16px] font-bold text-[#333843] whitespace-nowrap pl-4">
                                    {col.header}
                                </TableHead>
                            ))}
                            <TableHead className="text-[16px] font-bold text-[#333843] whitespace-nowrap pl-4">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="text-[#667085]">
                        {tableData.length > 0 ? (
                            tableData.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    <TableCell className="p-5 pl-4">
                                        {rowIndex + 1}
                                    </TableCell>
                                    {column.map((col, colIndex) => (
                                        <TableCell 
                                            key={colIndex} 
                                            className={`p-2 pl-4 ${col.accessorKey === 'asset_no' ? 'cursor-pointer text-blue-500' : ''}`}
                                            onClick={col.accessorKey === 'asset_no' ? () => handleAssetIdClick(row) : undefined}
                                        >
                                            {editingRow === row.asset_id ? (
                                                <Input
                                                    value={editedData[col.accessorKey] || ''}
                                                    onChange={(e) => handleInputChange(e, col.accessorKey)}
                                                    className="w-full"
                                                />
                                            ) : (
                                                col.accessorKey === 'asset_status' 
                                                    ? (row[col.accessorKey] === 1 ? 'Assigned' : 'Unassigned')
                                                    : (row[col.accessorKey] || '-')
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell className="flex items-center">
                                        {editingRow === row.asset_id ? (
                                            <>
                                                <Button onClick={handleSaveClick} className="mr-2 bg-[#134572] text-white">
                                                    <MdSave className="mr-1" /> Save
                                                </Button>
                                                <Button onClick={handleCancelEdit} variant="outline" className="bg-[#134572] text-white">
                                                    <MdCancel className="mr-1" /> Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button onClick={() => handleEditClick(row)} className="mr-2 bg-[#134572] text-white">
                                                    <MdEdit className="mr-1" /> Edit
                                                </Button>
                                                <Button onClick={() => handleDeleteClick(row.asset_id)} className="bg-[#134572] text-white">
                                                    <MdDelete className="mr-1" /> Delete
                                                </Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={column.length + 2} className="h-24 text-center">
                                    No records found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {isModalOpen && selectedAsset && (
                <AssetModal
                    assetId={selectedAsset.asset_id}
                    assetNo={selectedAsset.asset_no} 
                    assetType={selectedAsset.asset_type} 
                    assetStatus={selectedAsset.asset_status}
                    onClose={closeModal} 
                />
            )}
        </div>
    );
}
