"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import AssetModal from '../../../../components/ui/assetModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function DataTable({ data, column }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);

    const handleAssetIdClick = (asset) => {
        console.log("asset",asset);
        setSelectedAsset({
            asset_id:asset.asset_id,
            asset_no: asset.asset_no,
            asset_type: asset.asset_type,
            asset_status:asset.asset_status,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAsset(null);
    };

    return (
        <div className="w-full">
            <ToastContainer />
            <div className="p-2 py-4 relative overflow-x-auto">
                <Table className="w-full ml-4">
                    {/* Table Header */}
                    <TableHeader className="bg-[#f7f7f7] h-[60px] text-[#333843]">
                        <TableRow>
                            {/* Serial Number Header */}
                            <TableHead className="text-[16px] font-bold text-[#333843] whitespace-nowrap pl-4">
                                S.No
                            </TableHead>

                            {column.map((col, index) => (
                                <TableHead key={index} className="text-[16px] font-bold text-[#333843] whitespace-nowrap pl-4">
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className="text-[#667085]">
                        {data.length ? (
                            data.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {/* Serial Number Cell */}
                                    <TableCell className="p-5 pl-4" >
                                        {rowIndex + 1}
                                    </TableCell>

                                    {column.map((col, colIndex) => (
                                        <TableCell
                                            key={colIndex}
                                            className={`p-2 pl-4 ${col.accessorKey === 'asset_no' ? 'cursor-pointer text-blue-500' : ''}`}
                                            onClick={col.accessorKey === 'asset_no' ? () => handleAssetIdClick(row) : undefined}
                                        >
                                            {col.accessorKey === 'asset_status' ? (
                                                row[col.accessorKey] === 1 ? 'Assigned' : 'Unassigned'
                                            ) : (
                                                row[col.accessorKey] || '-'
                                            )}
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
{}
            {/* Render the AssetModal if it's open */}
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
