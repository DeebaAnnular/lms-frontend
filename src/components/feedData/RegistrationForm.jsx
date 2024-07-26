"use client";
import React, { useState } from "react";
import { capitalizeWords } from "../../utils";
import { API } from "../../config";

const RegistrationForm = ({ setIsShow }) => {
    const [formData, setFormData] = useState({
        emp_id: "",
        emp_name: "",
        gender: "",
        date_of_joining: "",
        contact_number: "",
        work_email: "",
        active_status: "", // This will be boolean
        designation: "",
        work_location: "",
        password: "",
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        let month = "" + (d.getMonth() + 1);
        let day = "" + d.getDate();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
    };

    const validateForm = () => {
        const missingFields = [];

        if (!formData.emp_id) missingFields.push("Employee ID");
        if (!formData.emp_name) missingFields.push("Employee Name");
        if (!formData.gender) missingFields.push("Gender");
        if (!formData.date_of_joining) missingFields.push("Date of Joining");
        if (!formData.contact_number) missingFields.push("Contact Number");
        if (!formData.work_email) missingFields.push("Work Email");
        if (!formData.active_status) missingFields.push("Employee Status");
        if (!formData.designation) missingFields.push("Designation");
        if (!formData.work_location) missingFields.push("Work Location");
        if (!formData.password) missingFields.push("Password");

        if (missingFields.length > 0) {
            alert(`Please fill in the following fields: ${missingFields.join(", ")}`);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const dataToSend = {
            ...formData,
            date_of_joining: formatDate(formData.date_of_joining),
            active_status: formData.active_status === "true", // Convert to boolean
        };

        try {
            const response = await fetch(`${API}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                alert("User registered successfully");
                // Optionally reset the form after successful submission
                setFormData({
                    emp_id: "",
                    emp_name: "",
                    gender: "",
                    date_of_joining: "",
                    contact_number: "",
                    work_email: "",
                    active_status: "",
                    designation: "",
                    work_location: "",
                    password: "",
                });
                setIsShow(false);
            } else {
                console.error("Failed to register user");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <div className="box md:max-h-[700px] relative top-1 flex flex-col items-center">
                <div className="mt-6 min-w-[500px]">
                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-20 flex-row">
                            <div className="min-w-[275px]">
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="emp_name" className="text-[14px] font-regular text-[#373857]">
                                        Employee Name
                                    </label>
                                    <input
                                        id="emp_name"
                                        value={capitalizeWords(formData.emp_name)}
                                        className="border border-[#B6B6B6] text-[16px] placeholder:text-[16px] rounded-md p-1 min-h-[40px]"
                                        type="text"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="gender" className="text-[14px] font-regular text-[#373857]">
                                        Gender
                                    </label>
                                    <select
                                        id="gender"
                                        value={formData.gender}
                                        className="border border-[#B6B6B6] text-[16px] placeholder:text-[16px] rounded-md p-1 min-h-[40px]"
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="date_of_joining" className="text-[14px] font-regular text-[#373857]">
                                        Date of Joining
                                    </label>
                                    <input
                                        id="date_of_joining"
                                        value={formData.date_of_joining}
                                        className="border border-[#B6B6B6] text-[16px] rounded-md p-1 focus:border-formblue hover:border-formblue min-h-[40px]"
                                        onChange={handleInputChange}
                                        type="date"
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="work_email" className="text-[14px] font-regular text-[#373857]">
                                        Work Email
                                    </label>
                                    <input
                                        id="work_email"
                                        value={formData.work_email}
                                        className="border border-[#B6B6B6] text-[16px] placeholder:text-[16px] rounded-md p-1 min-h-[40px]"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="work_location" className="text-[14px] font-regular text-[#373857]">
                                        Location
                                    </label>
                                    <input
                                        id="work_location"
                                        value={formData.work_location}
                                        className="border border-[#B6B6B6] text-[16px] placeholder:text-[16px] rounded-md p-1 min-h-[40px]"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="min-w-[275px]">
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="emp_id" className="text-[14px] font-regular text-[#373857]">
                                        Employee Id
                                    </label>
                                    <input
                                        id="emp_id"
                                        value={formData.emp_id}
                                        className="border border-[#B6B6B6] text-[16px] placeholder:text-[16px] rounded-md p-1 focus:border-formblue hover:border-formblue min-h-[40px]"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="contact_number" className="text-[14px] font-regular text-[#373857]">
                                        Contact No
                                    </label>
                                    <input
                                        id="contact_number"
                                        type="text"
                                        value={formData.contact_number}
                                        className="border border-[#B6B6B6] text-[16px] placeholder:text-[16px] rounded-md p-1 min-h-[40px]"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="designation" className="text-[14px] font-regular text-[#373857]">
                                        Role
                                    </label>
                                    <input
                                        id="designation"
                                        value={formData.designation}
                                        className="border border-[#B6B6B6] text-[16px] placeholder:text-[16px] rounded-md p-1 min-h-[40px]"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="password" className="text-[14px] font-regular text-[#373857]">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        className="border border-[#B6B6B6] text-[16px] placeholder:text-[16px] rounded-md p-1 min-h-[40px]"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="active_status" className="text-[14px] font-regular text-[#373857]">
                                        Employee Status
                                    </label>
                                    <select
                                        id="active_status"
                                        value={formData.active_status}
                                        className="border border-[#B6B6B6] text-[16px] placeholder:text-[16px] rounded-md p-1 min-h-[40px]"
                                        required
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="flex mt-3 w-full items-center justify-end">
                        <button
                            className="mr-2 py-1 px-2 w-[150px] rounded-sm h-fit text-white bg-[#134572] font-normal"
                            onClick={handleSubmit}
                        >
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;
