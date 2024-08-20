"use client";
import React, { useState, useEffect } from 'react';
import LeaveSettings from './leaveSettings';
import RoleSetting from './RoleSetting'; // If you want to use this component
import { capitalizeWords } from '../../utils';
import { updateEmpDetails, getEmp_detail_by_id } from '../../actions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeForm = ({ resData, id }) => {
    const [formData, setFormData] = useState({
        user_id: id,
        emp_id: resData.emp_id,
        emp_name: resData.emp_name,
        gender: resData.gender,
        contact_number: resData.contact_number,
        designation: resData.designation,
        date_of_joining: '', // Initialize with an empty string
        work_location: resData.work_location,
        active_status: Number(resData.active_status),
        role: resData.role || '', // Ensure that role is included in the state
    });

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            const updatedData = await getEmp_detail_by_id(id);
            setFormData(prevState => ({
                ...prevState,
                ...updatedData,
                date_of_joining: updatedData.date_of_joining ? new Date(updatedData.date_of_joining).toISOString().split('T')[0] : ''
            }));
        };

        fetchEmployeeDetails();
    }, [id]); // Fetch details when id changes

    const handleChange = (e) => {
        let { name, value } = e.target;

        // Format the date_of_joining if the input field is being changed
        if (name === 'date_of_joining') {
            const dateObj = new Date(value);
            // Check if the date is valid
            if (!isNaN(dateObj.getTime())) {
                value = dateObj.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
            } else {
                value = ''; // Reset to empty if invalid
            }
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate date_of_joining
        const joiningDate = new Date(formData.date_of_joining);
        const year = joiningDate.getFullYear();
        if (year < 1995 || year > 2040) {
            toast.error("Date of Joining must be between 1995 and 2040!");
            return; // Exit the function if the date is invalid
        }

        // Validate special characters in designation, emp_name, and work_location
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharRegex.test(formData.designation) || 
            specialCharRegex.test(formData.emp_name) || 
            specialCharRegex.test(formData.work_location)) {
            toast.error("Designation, Name, and Work Location must not contain special characters!");
            return; // Exit the function if validation fails
        }

        await updateEmpDetails(id, formData);
        toast.success("Employee details updated successfully!");
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="content-section w-full flex flex-col">
                <div className="personal-data bg-white rounded-none px-5 py-3">
                  
                    <div className='flex px-5 gap-12 justify-between'>

                        <div className='flex w-full flex-col gap-4'>
                            <div className='flex flex-col'>
                                <label className='font-bold'>Employee Id</label>
                                <input
                                    type="text"
                                    name="emp_id"
                                    value={formData.emp_id}
                                    onChange={handleChange}
                                    className='mt-1 p-2 border rounded min-w-[356px] h-[45px] text-[#667085]'
                                    minLength={3}
                                    maxLength={7}
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className='font-bold'>Name</label>
                                <input
                                    type="text"
                                    name="emp_name"
                                    value={capitalizeWords(formData.emp_name)}
                                    onChange={handleChange}
                                    className='mt-1 p-2 border rounded min-w-[356px] h-[45px] text-[#667085]'
                                    minLength={3}
                                    maxLength={30}
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className='font-bold'>Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className='mt-1 p-2 border rounded min-w-[356px] h-[45px] text-[#667085]'
                                >
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>
                            <div className='flex flex-col'>
                                <label className='font-bold'>Contact Number</label>
                                <input
                                    type="text"
                                    name="contact_number"
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    className='mt-1 p-2 border rounded min-w-[356px] h-[45px] text-[#667085]'
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className='font-bold'>User Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className='mt-1 p-2 border rounded min-w-[356px] h-[45px] text-[#667085]'
                                >
                                    <option value="admin">Admin</option>
                                    <option value="approver">Approver</option>
                                    <option value="employee">Employee</option>
                                </select>
                            </div>
                        </div>

                        <div className='flex flex-col gap-4 w-full'>
                            <div className='flex flex-col'>
                                <label className='font-bold'>Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={capitalizeWords(formData.designation)}
                                    onChange={handleChange}
                                    className='mt-1 p-2 border rounded min-min-w-[356px] h-[45px] text-[#667085]'
                                    minLength={2}
                                    maxLength={20}
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className='font-bold'>Date of Joining</label>
                                <input
                                    type="date" // Input type is set to 'date'
                                    name="date_of_joining"
                                    value={formData.date_of_joining} // This value is formatted in YYYY-MM-DD
                                    onChange={handleChange}
                                    className='mt-1 p-2 border rounded min-w-[356px] h-[45px] text-[#667085]'
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className='font-bold'>Work Location</label>
                                <input
                                    type="text"
                                    name="work_location"
                                    value={capitalizeWords(formData.work_location)}
                                    onChange={handleChange}
                                    className='mt-1 p-2 border rounded min-w-[356px] h-[45px] text-[#667085]'
                                    minLength={2}
                                    maxLength={30}
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className='font-bold'>Status</label>
                                <select
                                    name="active_status"
                                    value={formData.active_status}
                                    onChange={handleChange}
                                    className='mt-1 p-2 border rounded min-w-[356px] h-[45px] text-[#667085]'
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white relative flex flex-col items-end">
                    <div className='mt-3 ml-3'>
                        <button 
                            type="submit" 
                            className='bg-[#134572] w-[213px] h-[45px] mt-7 px-[20px] py-[10px] text-white text-[16px] font-bold rounded-[5px] border-none cursor-pointer'>
                            Update
                        </button>
                    </div>
                </div>

                <div className='bg-[#FBF9F9] h-[20px]'></div>

                
            </div>
        </form>
    );
};

export default EmployeeForm;