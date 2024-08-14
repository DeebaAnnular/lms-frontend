"use client";
import React, { useState } from "react";
import { capitalizeWords } from "../../utils";
import { ToastContainer, toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css'; 
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';



const RegistrationForm = ({ setIsShow }) => {
    const [formData, setFormData] = useState({
        emp_id: "",
        emp_name: "",
        last_name: "", // Added last_name field
        gender: "",
        date_of_joining: "",
        contact_number: "", // Store only the phone number without the country code
        work_email: "",
        active_status: "", // This will be boolean
        designation: "",
        work_location: "",
        password: "",
    });

    const [errors, setErrors] = useState({});

    const [countryCode, setCountryCode] = useState("+91"); // Default country code for India

    const handleInputChange = (id, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value ? value.replace(/^\s+/, '') : '', // Check if value is defined
        }));
    }; 

    const handleContactNumberChange = (value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            contact_number: value, // Store only the phone number
        }));
    };

    const handleInputChangeEvent = (e) => {
        handleInputChange(e.target.id, e.target.value);
    };
    
    const handleDateChange = (e) => {
        const date = e.target.value;
        const regex = /^\d{4}-\d{2}-\d{2}$/;

        if (regex.test(date)) {
            handleInputChange("date_of_joining", date);
        }
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
        const newErrors = {};
    
        if (!formData.emp_id.trim()) newErrors.emp_id = "Please fill this field";
        if (!formData.emp_name.trim()) newErrors.emp_name = "Please fill this field";
        if (!formData.last_name.trim()) newErrors.last_name = "Please fill this field"; // Added last_name check
        if (!formData.gender.trim()) newErrors.gender = "Please fill this field";
        if (!formData.date_of_joining.trim()) newErrors.date_of_joining = "Please fill this field";
        if (!formData.contact_number.trim()) newErrors.contact_number = "Please fill this field";
        if (!formData.work_email.trim()) newErrors.work_email = "Please fill this field";
        if (!formData.active_status.trim()) newErrors.active_status = "Please fill this field";
        if (!formData.designation.trim()) newErrors.designation = "Please fill this field";
        if (!formData.work_location.trim()) newErrors.work_location = "Please fill this field";
        if (!formData.password.trim()) newErrors.password = "Please fill this field";
    
        setErrors(newErrors);
    
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const dataToSend = {
            ...formData,
            emp_name: `${formData.emp_name} ${formData.last_name}`, // Combine first and last name
            date_of_joining: formatDate(formData.date_of_joining),
            active_status: formData.active_status === "true", // Convert to boolean
        };

        try {
            const response = await fetch("https://lms-api.annularprojects.com:3001/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                setFormData({
                    emp_id: "",
                    emp_name: "",
                    last_name: "", // Reset last_name
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
                toast.success("Registered Successfully")
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Error Registering User");
            }
        } catch (error) {
            console.error("Failed to register");
            toast.error(error.message, {
                style: { color: '#FFB6C1' },
            });
            console.error("Error:", error);
        }
    };

    const getInputClassName = (field) => {
        return `border ${errors[field] ? 'border-red-500' : 'border-[#B6B6B6]'} text-[16px] placeholder:text-[16px] rounded-md p-1 min-h-[40px]`;
    };

    const getTooltip = (field) => {
        return errors[field] ? errors[field] : "";
    };

    return (
        <div className="cursor-default">
            <div className="box md:max-h-[700px] relative top-1 flex flex-col items-center">
                <div className="mt-6 min-w-[500px]">
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="flex gap-20 flex-row">
                            <div className="min-w-[275px]">
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="emp_name" className="text-[14px] font-regular text-[#373857]">
                                        First Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="emp_name"
                                        value={capitalizeWords(formData.emp_name)}
                                        className={getInputClassName('emp_name')}
                                        type="text"
                                        required
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('emp_name')}
                                        minLength={2}
                                        maxLength={25}
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="last_name" className="text-[14px] font-regular text-[#373857]">
                                        Last Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="last_name"
                                        value={capitalizeWords(formData.last_name)}
                                        className={getInputClassName('last_name')}
                                        type="text"
                                        required
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('last_name')}
                                        minLength={2}
                                        maxLength={25}
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="gender" className="text-[14px] font-regular text-[#373857]">
                                        Gender<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="gender"
                                        required
                                        value={formData.gender}
                                        className={getInputClassName('gender')}
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('gender')}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="date_of_joining" className="text-[14px] font-regular text-[#373857]">
                                        Date of Joining<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="date_of_joining"
                                        required
                                        value={formData.date_of_joining}
                                        className={getInputClassName('date_of_joining')}
                                        onChange={handleDateChange}
                                        type="date"
                                        title={getTooltip('date_of_joining')}
                                        maxLength={10}
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="work_email" className="text-[14px] font-regular text-[#373857]">
                                        Work Email<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="work_email"
                                        type="email"
                                        value={formData.work_email}
                                        className={getInputClassName('work_email')}
                                        required
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('work_email')}
                                        
                                        
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="work_location" className="text-[14px] font-regular text-[#373857]">
                                        Location<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="work_location"
                                        value={formData.work_location}
                                        className={getInputClassName('work_location')}
                                        required
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('work_location')}
                                    />
                                </div>
                            </div>
                            <div className="min-w-[275px]">
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="emp_id" className="text-[14px] font-regular text-[#373857]">
                                        Employee Id<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="emp_id"
                                        required
                                        value={formData.emp_id}
                                        className={getInputClassName('emp_id')}
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('emp_id')}
                                        minLength={5}
                                        maxLength={13}
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="contact_number" className="text-[14px] font-regular text-[#373857]">
                                        Contact No<span className="text-red-500">*</span>
                                    </label>
                                    <PhoneInput
                                        id="contact_number"
                                        defaultCountry="IN"
                                        required
                                        limitMaxLength={17}
                                        value={formData.contact_number} // Use the phone number only
                                        className={getInputClassName('contact_number')}
                                        onChange={handleContactNumberChange} // Use the updated handler
                                        title={getTooltip('contact_number')}
                                        international // This prop shows the country code next to the flag
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="designation" className="text-[14px] font-regular text-[#373857]">
                                        Designation<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="designation"
                                        value={formData.designation}
                                        className={getInputClassName('designation')}
                                        required
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('designation')}
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="password" className="text-[14px] font-regular text-[#373857]">
                                        Password<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        className={getInputClassName('password')}
                                        required
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('password')}
                                        
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="active_status" className="text-[14px] font-regular text-[#373857]">
                                        Employee Status<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="active_status"
                                        value={formData.active_status}
                                        className={getInputClassName('active_status')}
                                        required
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('active_status')}
                                
                                    >
                                        <option value="">Select Status</option>
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex mt-3 w-full items-center justify-end">
                            <button
                                className="mr-2 py-1 px-2 w-[150px] rounded-sm h-fit text-white bg-[#134572] font-normal"
                                type="submit"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;