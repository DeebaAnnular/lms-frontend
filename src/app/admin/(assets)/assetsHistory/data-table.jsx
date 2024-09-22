import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "../../../../components/ui/button";
import { MdEdit, MdDelete, MdSave, MdCancel } from "react-icons/md";
import { Input } from "../../../../components/ui/input";
import { BiSort } from "react-icons/bi";
import { getAccessCardbyId } from "../../../../actions/assetApi";

import { deleteAsset, updateAssetDetails, getAllAssets } from '../../../../actions/assetApi';
import AssetModal from '../../../../components/ui/assetModal';

export function DataTable({ data, column }) {
    const [tableData, setTableData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setselectedAsset] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [sortOrder, setSortOrder] = useState('asc'); 

    useEffect(() => {
        if (data && data.length > 0) {
            setTableData(data);
        }
    }, [data]);

    const handleRefreshData = async () => {
        try {
            const refreshedData = await getAllAssets();
            setTableData(refreshedData);
        } catch (error) {
            console.log("Error refreshing data:", error);
        }
    }; 

    const handleSort = () => {
        const sortedData = [...tableData].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.asset_status - b.asset_status;
            } else {
                return b.asset_status - a.asset_status;
            }
        });
        setTableData(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sorting order
    };

    const handleAssetIdClick = (asset) => {
        setselectedAsset({
            asset_id: asset.asset_id,
            asset_no: asset.asset_no,
            asset_type: asset.asset_type,
            asset_status: asset.asset_status,
            emp_name: asset.emp_name,
            emp_id:asset.emp_id,
        });
        setIsModalOpen(true);
    }; 

    const closeModal = () => {
        console.log("close triggered");
        setIsModalOpen(false);
        setselectedAsset(null);
        handleRefreshData();
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
        const newValue = e.target.value;
        setEditedData(prevData => {
            const updatedData = { ...prevData, [accessorKey]: newValue };
    
            // Resetting 'ram' and 'rom' if asset_type is not 'Laptop'
            if (accessorKey === 'asset_type' && newValue !== 'Laptop') {
                updatedData.ram = '';
                updatedData.rom = '';
            }
    
            return updatedData;
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

    const renderEditField = (col, row) => {
        const isLaptop = editedData.asset_type === 'Laptop';
        switch (col.accessorKey) {
            case 'asset_type':
                return (
                    <select
                        value={editedData[col.accessorKey] || ''}
                        onChange={(e) => handleInputChange(e, col.accessorKey)}
                    >
                        <option value="">select</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Mouse">Mouse</option>
                        <option value="Printer">Printer</option>
                        <option value="Keyboard">Keyboard</option>
                    </select>
                );
            case 'asset_status':
                return (
                    <Input
                        value={row.asset_status === 1 ? 'Assigned' : 'UnAssigned'}
                        disabled
                        className="w-full"
                    />
                );
                case 'emp_name':
                    return (
                        <Input
                            value={editedData[col.accessorKey] || ''}
                            disabled
                            className="w-full bg-gray-100"
                        />
                    );
            case 'ram':
                return isLaptop ? (
                    <select
                        value={editedData[col.accessorKey] || ''}
                        onChange={(e) => handleInputChange(e, col.accessorKey)}
                    >
                        <option value="">Select</option>
                        <option value="8GB">8GB</option>
                        <option value="12GB">12GB</option>
                        <option value="16GB">16GB</option>
                        <option value="32GB">32GB</option>
                        <option value="64GB">64GB</option>
                    </select>
                ) : (
                    <Input
                        value={editedData[col.accessorKey] || ''}
                        disabled
                        className="w-full"
                    />
                );
            case 'rom':
                return isLaptop ? (
                    <select
                        value={editedData[col.accessorKey] || ''}
                        onChange={(e) => handleInputChange(e, col.accessorKey)}
                    >
                        <option value="">Select</option>
                        <option value="128GB (SSD)">128GB (SSD)</option>
                        <option value="256GB (SSD)">256GB (SSD)</option>
                        <option value="516GB (SSD)">516GB (SSD)</option>
                        <option value="1TB (SSD)">1TB (SSD)</option>
                        <option value="128GB (HDD)">128GB (HDD)</option>
                        <option value="256GB (HDD)">256GB (HDD)</option>
                        <option value="516GB (HDD)">516GB (HDD)</option>
                        <option value="1TB (HDD)">1TB (HDD)</option>
                    </select>
                ) : (
                    <Input
                        value={editedData[col.accessorKey] || ''}
                        disabled
                        className="w-full"
                    />
                );
            case 'operational_status':
                return (
                    <select
                        value={editedData[col.accessorKey] || ''}
                        onChange={(e) => handleInputChange(e, col.accessorKey)}
                    >
                        <option value="">select</option>
                        <option value="In use">In use</option>
                        <option value="Damage">Damage</option>
                    </select>
                );
            default:
                return (
                    <Input
                        value={editedData[col.accessorKey] || ''}
                        onChange={(e) => handleInputChange(e, col.accessorKey)}
                        className="w-full"
                    />
                );
        }
    };
    
    return (
        <div className="w-full">
            <ToastContainer />
            <div className="p-2 py-4 relative overflow-x-auto">
                <Table className="w-full ml-4">
                    <TableHeader className="bg-[#f7f7f7] h-[60px] text-[#333843]">
                        <TableRow>
                            <TableHead className="text-[13px] font-bold text-[#333843] whitespace-nowrap pl-4">
                                S.No
                            </TableHead>
                            {column.map((col, index) => (
                                <TableHead key={index} className="text-[13px] font-bold text-[#333843] whitespace-nowrap pl-4">
                                    {col.header}
                                    {col.accessorKey === 'asset_status' && (
                                        <BiSort
                                            className="inline ml-2 cursor-pointer"
                                            onClick={handleSort}
                                        />
                                    )}
                                </TableHead>
                            ))}
                            <TableHead className="text-[13px] font-bold text-[#333843] whitespace-nowrap pl-4">
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
                                        className={`p-2 pl-4 text-[12px] ${col.accessorKey === 'asset_no' && editingRow !== row.asset_id ? 'cursor-pointer text-blue-500' : ''}`}
                                        onClick={col.accessorKey === 'asset_no' && editingRow !== row.asset_id ? () => handleAssetIdClick(row) : undefined}
                                    >
                                        {editingRow === row.asset_id ? (
                                            renderEditField(col, row)
                                        ) : (
                                            col.accessorKey === 'asset_status' ? (
                                                row[col.accessorKey] === 1 ? 'Assigned' : 'UnAssigned'
                                            ) : col.accessorKey === 'emp_name' && row.asset_status === 0 ? (
                                                '-'  // Display dash if asset is UnAssigned
                                            ) : (
                                                row[col.accessorKey] || '-'  // Display employee name if Assigned
                                            )
                                        )}
                                    </TableCell>
                                    ))}
                                    <TableCell className="flex items-center">
                                        {editingRow === row.asset_id ? (
                                            <>
                                                <Button onClick={handleSaveClick} className="mr-2 px-2 py-2 text-xs bg-[#134572] text-white">
                                                    <MdSave className="mr-1" /> Save
                                                </Button>
                                                <Button onClick={handleCancelEdit} variant="outline" className="bg-[#134572] px-2 py-2 text-xs text-white">
                                                    <MdCancel className="mr-1" /> Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button onClick={() => handleEditClick(row)} className="mr-2 border px-2 py-1 text-xs   bg-[#134572] text-white">
                                                    <MdEdit className="mr-1 " /> Edit
                                                </Button>
                                                <Button onClick={() => handleDeleteClick(row.asset_id)} className="bg-[#134572] px-2 py-2 text-xs text-white">
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
                    refreshData={handleRefreshData}
                    empName={selectedAsset.emp_name}
                    empId={selectedAsset.emp_id}
                />
            )}
        </div>
    );
}