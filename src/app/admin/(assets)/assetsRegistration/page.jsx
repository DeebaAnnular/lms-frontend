"use client"
import React, { useState } from 'react';
import { postAssetDetails } from '../../../../actions/assetApi'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssetsRegistration = () => {
    const [formData, setFormData] = useState({
        asset_no: '',
        asset_type: '',
        brand_name: '',
        device_serial_number: '',
        asset_status: '',
        ram: '',
        rom: '',
        processor: '',
        ostype: '',
        ms_office_installed: '',
        purchase_date: '',
        purchase_cost: '',
        admin_configuration: '',
        operational_status: '',
        comments: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataObject = {};
        Object.keys(formData).forEach(key => {
            let value = formData[key];
            
            if (key === 'asset_status') {
                value = value === 'Assigned' ? 1 : value === 'UnAssigned' ? 0 : null;
            } else if (['ms_office_installed','admin_configuration'].includes(key)) {
                value = value === 'Yes' ? 1 : value === 'No' ? 0 : null;
            }
            else if (key === 'purchase_date') {
                value = new Date(value).toISOString().split('T')[0];
            } else if (key === 'purchase_cost') {
                value = parseFloat(value);
            }
            formDataObject[key] = value;
        });
        formDataObject.user_id = null; // or some value if you have user_id
    
        try {
            console.log("FormData", formDataObject);
            const response = await postAssetDetails(formDataObject);
            
            if (response.statusCode === 201) {
                setFormData({
                    asset_no: '',
                    asset_type: '',
                    brand_name: '',
                    device_serial_number: '',
                    asset_status: '',
                    ram: '',
                    rom: '',
                    processor: '',
                    ostype: '',
                    ms_office_installed: '',
                    purchase_date: '',
                    purchase_cost: '',
                    admin_configuration: '',
                    operational_status: '',
                    comments: '',
                });
                toast.success("Asset Registered Successfully");
            } else {
                toast.error(response.resmessage);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    };


    return (
        <div className='bg-white p-8'>
            <ToastContainer />
            <div><p className='text-[25px] font-inter'>Assets Registration</p></div>

            <form className='mt-8' onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                    <div className='space-y-4'>
                        <div className='flex flex-col'>
                            <label className='text-[16px] text-black'>Asset Type</label>
                            <select 
                                name="asset_type"
                                className='mt-1 p-2 border rounded min-w-[356px] w-[400px] h-[38px] text-[#667085]'
                                value={formData.asset_type}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="Laptop">Laptop</option>
                                <option value="Mouse">Mouse</option>
                                <option value="Printer">Printer</option>
                                <option value="Keyboard">Keyboard</option>
                            </select>
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[16px] text-black'>Asset No</label>
                            <input 
                                name="asset_no"
                                className='mt-1 p-2 border rounded min-w-[356px] w-[400px] h-[38px] text-[#667085]'
                                value={formData.asset_no}
                                onChange={handleChange}
                                minLength={2}
                                maxLength={9}
                            />
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[16px] text-black'>Brand Name</label>
                            <input 
                                name="brand_name"
                                className='mt-1 p-2 border rounded min-w-[356px] w-[400px] h-[38px] text-[#667085]'
                                value={formData.brand_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[16px] text-black'>Device S.no</label>
                            <input 
                                name="device_serial_number"
                                className='mt-1 p-2 border rounded min-w-[356px] w-[400px] h-[38px] text-[#667085]'
                                value={formData.device_serial_number}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[16px] text-black'>Asset Status</label>
                            <select 
                                name="asset_status"
                                className='mt-1 p-2 border rounded min-w-[356px] w-[400px] h-[38px] text-[#667085]'
                                value={formData.asset_status}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="Assigned">Assigned</option>
                                <option value="UnAssigned">UnAssigned</option>
                            </select>
                        </div>
                        <div className='flex flex-row mt-3 gap-14'>
                            <div className='flex flex-col'>
                                <label className='text-[16px] text-black'>RAM</label>
                                <select 
                                    name="ram"
                                    className='mt-1 p-2 border rounded w-[175px] h-[38px] text-[#667085]'
                                    disabled={formData.asset_type !== 'Laptop'}
                                    value={formData.ram}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="8GB">8GB</option>
                                    <option value="12GB">12GB</option>
                                    <option value="16GB">16GB</option>
                                    <option value="32GB">32GB</option>
                                    <option value="64GB">64GB</option>
                                </select>
                            </div>
                            <div className='flex flex-col'>
                                <label className='text-[16px] text-black'>ROM</label>
                                <select 
                                    name="rom"
                                    className='mt-1 p-2 border rounded w-[170px] h-[38px] text-[#667085]'
                                    disabled={formData.asset_type !== 'Laptop'}
                                    value={formData.rom}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="128GB (SSD)">128GB (SSD)</option>
                                    <option value="256GB (SSD)">256GB (SSD)</option>
                                    <option value="512GB (SSD)">512GB (SSD)</option>
                                    <option value="01TB (SSD)">01TB (SSD)</option>
                                    <option value="128GB (HDD)">128GB (HDD)</option>
                                    <option value="256GB (HDD)">256GB (HDD)</option>
                                    <option value="512GB (HDD)">512GB (HDD)</option>
                                    <option value="01TB (HDD)">01TB (HDD)</option>
                                </select>
                            </div>
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[16px] text-black'>Processor</label>
                            <select 
                                name="processor"
                                className='mt-1 p-2 border rounded min-w-[356px] w-[400px] h-[38px] text-[#667085]'
                                disabled={formData.asset_type !== 'Laptop'}
                                value={formData.processor}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="i3-8100U">Intel Core i3-8100U</option>
                                <option value="i3-8145U">Intel Core i3-8145U</option>
                                <option value="i3-10110U">Intel Core i3-10110U</option>
                                <option value="i3-1115G4">Intel Core i3-1115G4</option>
                                <option value="i5-8250U">Intel Core i5-8250U</option>
                                <option value="i5-8265U">Intel Core i5-8265U</option>
                                <option value="i5-1035G1">Intel Core i5-1035G1</option>
                                <option value="i5-1135G7">Intel Core i5-1135G7</option>
                            </select>
                        </div>
                    </div>
                    <div className='space-y-4'>
                        <div className='flex flex-col'>
                            <label className='text-[16px] text-black'>OS Type</label>
                            <select 
                                name="ostype"
                                className='mt-1 p-2 border rounded min-w-[356px] w-[400px] h-[38px] text-[#667085]'
                                disabled={formData.asset_type !== 'Laptop'}
                                value={formData.ostype}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="Windows">Windows</option>
                                <option value="Mac OS">Mac OS</option>
                                <option value="Linux">Linux</option>
                            </select>
                        </div>
                        <div className='flex flex-row mt-3 gap-14'>
                            <div className='flex flex-col'>
                                <label className='text-[16px] text-black'>MS office installed?</label>
                                <select 
                                    name="ms_office_installed"
                                    className='mt-1 p-2 border rounded w-[400px] h-[38px] text-[#667085]'
                                    disabled={formData.asset_type !== 'Laptop'}
                                    value={formData.ms_office_installed}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[16px] text-black'>Purchased Date</label>
                            <input 
                                name="purchase_date"
                                className='mt-1 p-2 border rounded min-w-[356px] w-[400px] h-[38px] text-[#667085]'
                                type='date'
                                value={formData.purchase_date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[16px] text-black'>Purchased Cost</label>
                            <input 
                                name="purchase_cost"
                                className='mt-1 p-2 border rounded min-w-[356px] w-[400px] h-[38px] text-[#667085]'
                                value={formData.purchase_cost}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[16px] text-black'>Admin Configuration?</label>
                            <select 
                            disabled={formData.asset_type !== 'Laptop'}
                                name="admin_configuration"
                                className='mt-1 p-2 border rounded min-w-[356px] w-[400px] h-[38px] text-[#667085]'
                                value={formData.admin_configuration}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[16px] text-black'>Operational Status</label>
                            <select 
                                name="operational_status"
                                className='mt-1 p-2 border rounded min-w-[356px] w-[400px] h-[38px] text-[#667085]'
                                value={formData.operational_status}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="In use">In use</option>
                                <option value="Damage">Damage</option>
                            </select>
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[16px] text-black'>Comments</label>
                            <input 
                                name="comments"
                                className='mt-1 p-2 border rounded min-w-[356px] w-[400px] h-[38px] text-[#667085]'
                                value={formData.comments}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex mt-5 w-full justify-end items-end">
                <button className="px-10 w-[249px] h-[35px] rounded-xs hover:text-[#A6C4F0] hover:bg-[#134572]  bg-[#134572] text-white text-lg">
                        Submit
                    </button>
                    </div>
                    </form></div>)}

                    
export default AssetsRegistration;
