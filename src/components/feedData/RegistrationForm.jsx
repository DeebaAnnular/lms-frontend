"use client";
import React, { useState } from "react";
import { capitalizeWords } from "../../utils";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { getallemp } from "../../actions";



const RegistrationForm = ({ setIsShow,setEmp_list }) => {
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
    const fetchEmployees = async () => {
        const data = await getallemp();
        setEmp_list(data);
    };


    const validateForm = () => {
        const newErrors = {};

        if (!formData.emp_id.trim()) {
            newErrors.emp_id = "Please fill this field";
            toast.error("Please fill Employee ID field"); // New toast notification
        }
        if (!formData.emp_name.trim()) {
            newErrors.emp_name = "Please fill this field";
            toast.error("Please fill First Name field"); // New toast notification
        }
        if (!formData.last_name.trim()) {
            newErrors.last_name = "Please fill this field"; // Added last_name check
            toast.error("Please fill Last Name field"); // New toast notification
        }
        if (!formData.gender.trim()) {
            newErrors.gender = "Please fill this field";
            toast.error("Please fill Gender field"); // New toast notification
        }
        if (!formData.date_of_joining.trim()) {
            newErrors.date_of_joining = "Please fill this field";
            toast.error("Please fill Date of Joining field"); // New toast notification
        }
        if (!formData.contact_number.trim()) {
            newErrors.contact_number = "Please fill this field";
            toast.error("Please fill Contact Number field"); // New toast notification
        }
        if (!formData.work_email.trim()) {
            newErrors.work_email = "Please fill this field";
            toast.error("Please fill Work Email field"); // New toast notification
        }
        if (!formData.active_status.trim()) {
            newErrors.active_status = "Please fill this field";
            toast.error("Please fill Employee Status field"); // New toast notification
        }
        if (!formData.designation.trim()) {
            newErrors.designation = "Please fill this field";
            toast.error("Please fill Designation field"); // New toast notification
        }
        if (!formData.work_location.trim()) {
            newErrors.work_location = "Please fill this field";
            toast.error("Please fill Location field"); // New toast notification
        }
        if (!formData.password.trim()) {
            newErrors.password = "Please fill this field";
            toast.error("Please fill Password field"); // New toast notification
        }

        // Check for special characters in specific fields
        const specialCharRegex = /[^a-zA-Z0-9 ]/; // Allow spaces

        if (specialCharRegex.test(formData.emp_name)) {
            newErrors.emp_name = "First Name should not contain special characters";
            toast.error("First Name should not contain special characters"); // New toast notification
        }
        if (specialCharRegex.test(formData.last_name)) {
            newErrors.last_name = "Last Name should not contain special characters";
            toast.error("Last Name should not contain special characters"); // New toast notification
        }
        if (specialCharRegex.test(formData.designation)) {
            newErrors.designation = "Designation should not contain special characters";
            toast.error("Designation should not contain special characters"); // New toast notification
        }
        if (specialCharRegex.test(formData.work_location)) {
            newErrors.work_location = "Location should not contain special characters"; // Added toast for location
            toast.error("Location should not contain special characters"); // New toast notification
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleInput = (e) => {
        let { name, value } = e.target;

        // Remove special characters from the input value
        value = value.replace(/[^a-zA-Z0-9 ]/g, '');

        // Enforce maxLength for emp_id
        if (name === "emp_id" && value.length > 7) {
            value = value.slice(0, 6); // Limit to 7 characters
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Check for special characters in emp_id
        if (/[^a-zA-Z0-9]/.test(formData.emp_id)) {
            toast.error("Employee ID should not contain special characters");
            return;
        } 

        if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{3,7}$/.test(formData.emp_id)) {
            // newErrors.emp_id = "Employee ID must contain at least one letter and one number, and be 3-7 characters long";
            toast.error("Employee ID must contain at least one letter and one number, and be 3-7 characters long");
            return;
        }
        let formattedContactNumber = formData.contact_number.trim();

        // If the contact number starts with the country code, make sure there's a space after the country code
        if (formattedContactNumber.startsWith(countryCode)) {
            formattedContactNumber = `${countryCode} ${formattedContactNumber.slice(countryCode.length).trim()}`;
        } else {
            // If it doesn't start with the country code, prepend the country code with a space
            formattedContactNumber = `${countryCode} ${formattedContactNumber}`;
        }

        const dataToSend = {
            ...formData,
            emp_name: `${formData.emp_name} ${formData.last_name}`, // Combine first and last name
            date_of_joining: formatDate(formData.date_of_joining),
            active_status: formData.active_status === "true", // Convert to boolean
            contact_number: formattedContactNumber,
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
                fetchEmployees();
                
                
            } else {
                const errorData = await response.json();
                console.log("checking", errorData);
                toast.error(errorData.error || errorData.message || "Error Registering User");
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
        return `border ${errors[field] ? 'border-red-500' : 'border-[#B6B6B6]'} text-[14px] placeholder:text-[16px] rounded-md p-1 min-h-[40px]`;
    };

    const getTooltip = (field) => {
        return errors[field] ? errors[field] : "";
    };

    return (
        <div className="cursor-default">
            <div className="box md:max-h-[500px] relative top-1 flex flex-col items-center">
                <div className="mt-6 w-full max-w-[600px]">
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="flex gap-20 flex-row">
                            <div className="min-w-[275px]">
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="emp_name" className="text-[11px] font-regular text-[#373857]">
                                        First Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="emp_name"
                                        value={capitalizeWords(formData.emp_name)}
                                        className={`${getInputClassName('emp_name')}  w-[220px] min-h-[20px] `}
                                        type="text"
                                        required
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('emp_name')}
                                        minLength={2}
                                        maxLength={25}
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="last_name" className="text-[11px]  font-regular text-[#373857]">
                                        Last Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="last_name"
                                        value={capitalizeWords(formData.last_name)}
                                        className={`${getInputClassName('last_name')} w-[220px] min-h-[20px] `}
                                        type="text"
                                        required
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('last_name')}
                                        minLength={1}
                                        maxLength={25}
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="gender" className="font-regular text-[11px] text-[#373857]">
                                        Gender<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="gender"
                                        required
                                        value={formData.gender}
                                        className={`${getInputClassName('gender')} w-[220px] min-h-[20px] `}
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('gender')}
                                    >
                                        <option value="">Select</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="O">Others</option>
                                    </select>
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="date_of_joining" className="text-[11px] min-h-[10px] font-regular text-[#373857]">
                                        Date of Joining<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="date_of_joining"
                                        required
                                        value={formData.date_of_joining}
                                        className={`${getInputClassName('date_of_joining')} w-[220px] min-h-[20px] text-black placeholder-gray-400`}
                                        onChange={handleDateChange}
                                        type="date"
                                        title={getTooltip('date_of_joining')}
                                        maxLength={10}
                                        style={{ color: formData.date_of_joining ? 'inherit' : '#9ca3af' }}
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="work_email" className="text-[11px]  font-regular text-[#373857]">
                                        Work Email<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="work_email"
                                        type="email"
                                        value={formData.work_email}
                                        className={`${getInputClassName('work_email')} w-[220px] min-h-[20px] `}
                                        required
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('work_email')}


                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="password" className="text-[11px] min-h-[10px] font-regular text-[#373857]">
                                        Password<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        className={`${getInputClassName('password')} w-[220px] min-h-[20px] `}
                                        required
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('password')}
                                        minLength={4}
                                        maxLength={25}

                                    />
                                </div>
                                
                            </div>
                            <div className="min-w-[275px]">
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="emp_id" className="text-[11px] min-h-[10px] font-regular text-[#373857]">
                                        Employee Id<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="emp_id"
                                        required
                                        value={formData.emp_id}
                                        className={`${getInputClassName('emp_id')} w-[220px] min-h-[20px] `}
                                        onChange={handleInputChangeEvent}
                                        onInput={handleInput}
                                        title={getTooltip('emp_id')}
                                        minLength={3}
                                        maxLength={7}
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="contact_number" className="text-[11px] min-h-[10px] font-regular text-[#373857]">
                                        Contact No<span className="text-red-500">*</span>
                                    </label>
                                    <PhoneInput
                                        id="contact_number"
                                        defaultCountry="IN"
                                        required
                                        limitMaxLength={17}
                                        value={formData.contact_number} // Use the phone number only
                                        className={`${getInputClassName('contact_number')} w-[220px] min-h-[20px] `}
                                        onChange={handleContactNumberChange} // Use the updated handler
                                        title={getTooltip('contact_number')}
                                        international // This prop shows the country code next to the flag
                                    />
                                </div>
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="designation" className="text-[11px] min-h-[10px] font-regular text-[#373857]">
                                        Designation<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="designation"
                                        value={formData.designation}
                                        className={`${getInputClassName('designation')} w-[220px] min-h-[20px] `}
                                        required
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('designation')}
                                    />
                                </div> 
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="work_location" className="text-[11px] min-h-[10px] font-regular text-[#373857]">
                                        Location<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="work_location"
                                        value={formData.work_location}
                                        className={`${getInputClassName('work_location')} w-[220px] min-h-[20px] `}
                                        required
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('work_location')} 
                                        minLength={2}
                                        maxLength={30}
                                    />
                                </div>
                                
                                <div className='flex flex-col mb-3'>
                                    <label htmlFor="active_status" className="text-[11px] min-h-[10px] font-regular text-[#373857]">
                                        Employee Status<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="active_status"
                                        value={formData.active_status}
                                        className={`${getInputClassName('active_status')} w-[220px] min-h-[20px] `}
                                        required
                                        onChange={handleInputChangeEvent}
                                        title={getTooltip('active_status')}

                                    >
                                        <option value="">Select</option>
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full items-center justify-end">
                            <button
                                className="mr-2 py-1 px-2 w-[150px] text-sm rounded-sm h-fit text-white bg-[#134572] font-normal"
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