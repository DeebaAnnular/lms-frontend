import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { IoIosClose } from 'react-icons/io'; // Import the close icon
import { Input } from '../../components/ui/input'; // Assuming you have a custom Input component
import { Button } from '../../components/ui/button'; // Assuming you have a custom Button component
import { getallemp } from '../../actions'; // Assuming this fetches employee data
import { postmapAssetWithEmployee, returnAssetToAdmin } from '../../actions/assetApi'; // Import the new API function
import { cn } from '../../lib/utils';
import { toast } from 'react-toastify';

const AssetModal = ({assetNo, assetId, assetType,assetStatus, onClose }) => {
    console.log("popup",assetId,assetNo,assetStatus,assetType)
    const AssetStatus= assetStatus === 0 ? 'Unassigned' : 'Assigned';
    const [formData, setFormData] = useState({
        assetNo: assetNo || '',
        assetName: assetType || '',
        empDetails: '',
        assetStatus: AssetStatus,
        issueDate: '',
        returnDate: ''
    });

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        // Fetch all employees when the modal opens
        const fetchEmployees = async () => {
            try {
                const employeeData = await getallemp(); // Assuming this returns an array of employee objects
                setEmployees(employeeData);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleReturn = async () => {
        try {
            // Extract employee ID and name from selected employee details
            const [emp_name, emp_id] = formData.empDetails.split(' (');

            const returnData = {
                asset_id:assetId,
                user_id: employees.find(emp => emp.emp_id === emp_id.replace(')', '')).user_id,
                emp_name: emp_name.trim(),
                emp_id: emp_id.replace(')', ''),
                return_date: formData.returnDate,
                asset_status: formData.assetStatus === 'Unassigned' ? 0 : 1,
            };

            const response = await returnAssetToAdmin(returnData);

            if (response.statusCode === 200) {
                toast.success("Asset successfully returned")
                console.log('Asset successfully returned:', returnData);
            } else {
                console.error('Error returning asset:', response.resmessage);
                toast.error(response.resmessage)
            }
            onClose();
        } catch (error) {
            console.error('Error returning asset:', error);
        }
    };

    const handleAllocate = async () => {
        try {
            // Extract employee ID and name from selected employee details
            const [emp_name, emp_id] = formData.empDetails.split(' (');

            const assetData = {
                asset_id:assetId,
                user_id: employees.find(emp => emp.emp_id === emp_id.replace(')', '')).user_id,
                emp_name: emp_name.trim(),
                emp_id: emp_id.replace(')', ''),
                issue_date: formData.issueDate,
                asset_status: formData.assetStatus === 'Assigned' ? 1 : 0,
            };
            console.log("allocated",assetData);
            const response = await postmapAssetWithEmployee(assetData);
            
           

            if (response.statusCode === 200) {
                toast.success("Asset successfully allocated")
                console.log('Asset successfully allocated to employee:', assetData);
            } else {
                console.error('Error allocating asset:', response.resmessage);
                toast.error(response.resmessage)
            }
            onClose();
        } catch (error) {
            console.error('Error allocating asset:', error);
        }
    };

    const isReturnDateDisabled = formData.issueDate !== '';
    const isIssueDateDisabled = formData.returnDate !== '';

    return (
        <Dialog open={true} onClose={onClose}>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30 z-40" aria-hidden="true"></div>

            {/* Modal Panel */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <Dialog.Panel className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg z-50">
                    {/* Close Button */}
                    <button onClick={onClose}
                            className="absolute top-2 right-2 text-red-500 text-xl border border-red-500 rounded-full"
                        >
                            <IoIosClose />
                        </button>

                    <Dialog.Title className="text-xl font-semibold mb-4">Asset Details</Dialog.Title>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Asset No</label>
                            <Input name="assetId" value={formData.assetNo} onChange={handleChange} readOnly />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Asset Name</label>
                            <Input name="assetName" value={formData.assetName} onChange={handleChange} readOnly />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Employee Details</label>
                            <select
                                name="empDetails"
                                value={formData.empDetails}
                                onChange={handleChange}
                                className="block w-full mt-1 border border-gray-300"
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
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Asset Status</label>
                            <select
                                name="assetStatus"
                                value={formData.assetStatus}
                                onChange={handleChange}
                                className="block w-full mt-1 border border-gray-300">
                                <option>{formData.assetStatus}</option>
                                <option value="Assigned">Assigned</option>
                                <option value="Unassigned">Unassigned</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Issue Date</label>
                            <Input
                                name="issueDate"
                                type="date"
                                value={formData.issueDate}
                                onChange={handleChange}
                                disabled={isIssueDateDisabled}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Return Date</label>
                            <Input
                                name="returnDate"
                                type="date"
                                value={formData.returnDate}
                                onChange={handleChange}
                                disabled={isReturnDateDisabled}
                            />
                        </div>

                        <div className="flex justify-end space-x-4 mt-4">
                            <Button className="bg-[#134572] text-white" onClick={handleReturn} variant="secondary">Return</Button>
                            <Button className="bg-[#134572]" onClick={handleAllocate}>Allocate</Button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default AssetModal;
