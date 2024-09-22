"use client"
import React, { useState, useEffect } from 'react';
import { IoIosClose } from 'react-icons/io';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { getallemp } from '../../actions';
import { getAllAssets } from '../../actions/assetApi';
import { postmapAssetWithEmployee, returnAssetToAdmin } from '../../actions/assetApi';
import { getAccessCardbyId } from '../../actions/assetApi';
import { cn } from '../../lib/utils'
import { toast } from 'react-toastify';

const AssetModal = ({ assetNo, assetId, assetType, assetStatus, onClose, refreshData, empName, empId }) => {
    console.log("popup", assetId, assetNo, assetStatus, assetType, empName, empId);
    const initialAssetStatus = assetStatus === "0" || assetStatus === 0 ? 'UnAssigned' : 'Assigned';
    const [formData, setFormData] = useState({
        assetNo: assetNo || '',
        assetName: assetType || '',
        empDetails: initialAssetStatus === 'Assigned' ? `${empName} (${empId})` : '',
        assetStatus: initialAssetStatus,
        issueDate: '',
        returnDate: ''
    });

    const [employees, setEmployees] = useState([]);
    const [returnError, setReturnError] = useState('');
    const [allocateError, setAllocateError] = useState('');
    const [issueDateError, setIssueDateError] = useState('');
    const [returnDateError, setReturnDateError] = useState('');
    const [empDetailsError, setEmpDetailsError] = useState('');


    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const employeeData = await getallemp();
                setEmployees(employeeData);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, [assetId, assetStatus]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
              // Clear date errors when dates are entered
              if (name === 'issueDate') setIssueDateError('');
              if (name === 'returnDate') setReturnDateError('');
      
              // Clear return error when asset status is changed to UnAssigned
              if (name === 'assetStatus' && value === 'UnAssigned') {
                  setReturnError('');
              }
      
              // Clear allocate error when asset status is changed to Assigned
              if (name === 'assetStatus' && value === 'Assigned') {
                  setAllocateError('');
              }

               // Clear employee details error when an employee is selected
        if (name === 'empDetails' && value !== '') {
            setEmpDetailsError('');
        }

      
    };

    const handleReturn = async () => {

        if (assetStatus !== "1" && assetStatus !== 1 && assetStatus !== "Assigned") {
            setReturnError("Can't return when the asset is Unassigned");
            return;
        }
        if (formData.assetStatus !== 'UnAssigned') {
            setReturnError("Please set Asset Status to UnAssigned before returning");
            return;
        }
        if (!formData.returnDate) {
            setReturnDateError("Please enter a return date");
            return;
        }
       
        setReturnError('');
        setReturnDateError('');
        setEmpDetailsError('');


        try {
            let emp_name, emp_id;
            if (formData.assetStatus === 'Assigned') {
                emp_name = empName;
                emp_id = empId;
            } else {
                [emp_name, emp_id] = formData.empDetails.split(' (');
                emp_id = emp_id.replace(')', '');
            }

            const returnData = {
                asset_id: assetId,
                user_id: employees.find(emp => emp.emp_id === emp_id.replace(')', '')).user_id,
                emp_name: emp_name.trim(),
                emp_id: emp_id.replace(')', ''),
                return_date: formData.returnDate,
                asset_status: 0,
            };
            console.log("returndata", returnData);

            const response = await returnAssetToAdmin(returnData);

            if (response.statusCode === 200) {
                toast.success("Asset successfully returned");
                console.log('Asset successfully returned:', returnData);
                onClose();
            } else {
                console.error('Error returning asset:', response.resmessage);
                toast.error(response.resmessage);
            }
        } catch (error) {
            console.error('Error returning asset:', error);
        }
    };

    const handleAllocate = async () => {

        if (!formData.empDetails) {
            setEmpDetailsError("Please select an employee");
            return;
        }

        if (assetStatus !== "0" && assetStatus !== 0 && assetStatus !== "UnAssigned") {
            setAllocateError("Can't Allocate when the asset is Assigned");
            return;
        }
        if (formData.assetStatus !== 'Assigned') {
            setAllocateError("Please set Asset Status to Assigned before allocating");
            return;
        }
        if (!formData.issueDate) {
            setIssueDateError("Please enter an issue date");
            return;
        }
        setAllocateError('');
        setIssueDateError('');

        try {
            const [emp_name, emp_id] = formData.empDetails.split(' (');

            const assetData = {
                asset_id: assetId,
                user_id: employees.find(emp => emp.emp_id === emp_id.replace(')', '')).user_id,
                emp_name: emp_name.trim(),
                emp_id: emp_id.replace(')', ''),
                issue_date: formData.issueDate,
                asset_status: 1,
            };
            console.log("allocated", assetData);
            const response = await postmapAssetWithEmployee(assetData);

            if (response.statusCode === 200) {
                toast.success("Asset successfully allocated");
                refreshData();
                console.log('Asset successfully allocated to employee:', assetData);
                onClose();
            } else {
                console.error('Error allocating asset:', response.resmessage);
                toast.error(response.resmessage);
            }
        } catch (error) {
            console.error('Error allocating asset:', error);
        }
    };

    // Determine which date input should be disabled based on the initial asset status
    const isIssueDateDisabled = assetStatus === "1" || assetStatus === 1;
    const isReturnDateDisabled = assetStatus === "0" || assetStatus === 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0  bg-black/30 z-40" aria-hidden="true" onClick={onClose}></div>
            <div className="relative bg-white p-6  rounded-lg shadow-lg w-full max-w-md  z-50">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-red-500 text-lg border border-red-500 rounded-full"
                >
                    <IoIosClose />
                </button>

                <h2 className="font-semibold mb-4 text-sm">Asset Details</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Asset No</label>
                        <Input name="assetId"  className="h-7 text-xs" value={formData.assetNo} onChange={handleChange} readOnly />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700">Asset Name</label>
                        <Input name="assetName" className="h-7 text-xs" value={formData.assetName} onChange={handleChange} readOnly />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700">Employee Details</label>
                        {assetStatus === "1" || assetStatus === 1 ? (
                            <Input 
                                name="empDetails" 
                                value={`${empName} (${empId})`}
                                readOnly 
                                className="h-7 text-xs"
                            />
                        ) : (
                            <select
                                name="empDetails"
                                value={formData.empDetails}
                                onChange={handleChange}
                                className="block w-full mt-1 border border-gray-300 h-8 text-xs rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            >
                                <option value="">Select</option>
                                {employees.map((employee) => (
                                    <option
                                        key={employee.user_id}
                                        value={`${employee.emp_name} (${employee.emp_id})`}
                                    >
                                        {employee.emp_name} ({employee.emp_id})
                                    </option>
                                ))}
                            </select>
                        )}
                         {empDetailsError && <p className="text-red-500 text-xs mt-1">{empDetailsError}</p>}

                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700">Asset Status</label>
                        <select
                            name="assetStatus"
                            value={formData.assetStatus}
                            onChange={handleChange}
                            className="block w-full text-xs h-7 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                            <option value="Assigned">Assigned</option>
                            <option value="UnAssigned">UnAssigned</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700">Issue Date</label>
                        <Input
                            name="issueDate"
                            type="date"
                            value={formData.issueDate}
                            onChange={handleChange}
                            disabled={isIssueDateDisabled}
                            className="h-7 text-xs"
                        />
                        {!isIssueDateDisabled && issueDateError && <p className="text-red-500 text-xs mt-1">{issueDateError}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700">Return Date</label>
                        <Input
                            name="returnDate"
                            type="date"
                            value={formData.returnDate}
                            onChange={handleChange}
                            disabled={isReturnDateDisabled}
                            className="h-7 text-xs"
                        />
                        {!isReturnDateDisabled && returnDateError && <p className="text-red-500 text-xs mt-1">{returnDateError}</p>}
                    </div>
                    <div className="flex justify-end space-x-4 mt-4">
                        <div className="flex flex-col items-end">
                            <Button className="bg-[#134572] px-4 h-8 text-white text-xs" onClick={handleReturn} variant="secondary">Return</Button>
                        </div>
                        <div className="flex flex-col items-end">
                            <Button className="bg-[#134572] text-xs px-3 h-8" onClick={handleAllocate}>Allocate</Button>
                        </div>
                    </div>
                    {returnError && <p className="text-red-500 text-xs mt-1">{returnError}</p>}
                    {allocateError && <p className="text-red-500 text-xs mt-1">{allocateError}</p>}
                </div>
            </div>
        </div>
    );
};

export default AssetModal;