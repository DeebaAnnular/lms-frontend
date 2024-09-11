"use client"
import React, { useState } from 'react';
import { postAssetDetails } from '../../../../actions/assetApi'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssetsHistory from '../assetsHistory/page';

const AssetsManagement = () => {
    const [activeTab, setActiveTab] = useState('registration');
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


    const [errors, setErrors] = useState({
        asset_no: '',
        asset_type: '',
        brand_name: '',
        device_serial_number: '',
        asset_status: '',
        purchase_date: '',
        purchase_cost: '',
        operational_status: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        })); 

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    }; 

    const validateForm = () => {
        const newErrors = {};

        if (!formData.asset_no) newErrors.asset_no = 'Asset No is required';
        if (!formData.asset_type) newErrors.asset_type = 'Asset Type is required';
        if (!formData.brand_name) newErrors.brand_name = 'Brand Name is required';
        if (!formData.device_serial_number) newErrors.device_serial_number = 'Device S.no is required';
        if (!formData.asset_status) newErrors.asset_status = 'Asset Status is required';
        if (!formData.purchase_date) newErrors.purchase_date = 'Purchase Date is required';
        if (!formData.purchase_cost) newErrors.purchase_cost = 'Purchase Cost is required';
        if (!formData.operational_status) newErrors.operational_status = 'Operational Status is required';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataObject = {};
        Object.keys(formData).forEach(key => {
            let value = formData[key];
            
            if (key === 'asset_status') {
                if (value === 'Assigned') {
                    value = "1";
                } else if (value === 'UnAssigned') {
                    value = "0";
                } else {
                    value = null;  // Fallback only if it's neither 'Assigned' nor 'Unassigned'
                }
            } else if (['ms_office_installed', 'admin_configuration'].includes(key)) {
                if (value === 'Yes') {
                    value = 1;
                } else if (value === 'No') {
                    value = 0;
                } else {
                    value = null;  // Fallback only if it's neither 'Yes' nor 'No'
                }
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
            <div className="flex mb-4 bg-gray-100">
    <button
        className={`mr-4 w-[50%] px-4 py-2 border-b-4 text-sm transition-all duration-200 ${activeTab === 'registration' ? 'border-[#134572] text-[#134572]' : 'border-transparent text-black'}`}
        onClick={() => setActiveTab('registration')}
        style={{ transformOrigin: 'right' }}
    >
        Asset Registration
    </button>
    <button
        className={`px-4 py-2 w-[50%] border-b-4 text-sm transition-all duration-200 ${activeTab === 'history' ? 'border-[#134572] text-[#134572]' : 'border-transparent text-black'}`}
        onClick={() => setActiveTab('history')}
        style={{ transformOrigin: 'left' }}
    >
        Asset Details
    </button>
</div>



            {activeTab === 'registration' ? (
                <>
                    <form className='mt-8' onSubmit={handleSubmit}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                    <div className='space-y-4'>
                        <div className='flex flex-col'>
                            <label className='text-[13px]  text-black'>Asset Type<span className='text-red-500'>*</span></label>
                            <select 
                                name="asset_type"
                                className='mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]'
                                value={formData.asset_type}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="Laptop">Laptop</option>
                                <option value="Mouse">Mouse</option>
                                <option value="Printer">Printer</option>
                                <option value="Keyboard">Keyboard</option>
                            </select>
                            {errors.asset_type && <span className="text-red-500 text-sm mt-1">{errors.asset_type}</span>}
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[13px] text-black'>Asset No<span className='text-red-500'>*</span></label>
                            <input 
                                name="asset_no"
                                className='mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]'
                                value={formData.asset_no}
                                onChange={handleChange}
                                minLength={2}
                                maxLength={9}
                            />
                            {errors.asset_no && <span className="text-red-500 text-sm mt-1">{errors.asset_no}</span>}
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[13px] text-black'>Brand Name<span className='text-red-500'>*</span></label>
                            <input 
                                name="brand_name"
                                className='mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]'
                                value={formData.brand_name}
                                onChange={handleChange}
                            />
                            {errors.brand_name && <span className="text-red-500 text-sm mt-1">{errors.brand_name}</span>}
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[13px] text-black'>Device S.no<span className='text-red-500'>*</span></label>
                            <input 
                                name="device_serial_number"
                                className='mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]'
                                value={formData.device_serial_number}
                                onChange={handleChange}
                            />
                            {errors.device_serial_number && <span className="text-red-500 text-sm mt-1">{errors.device_serial_number}</span>}
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[13px] text-black'>Asset Status</label>
                            <select 
                                name="asset_status"
                                className='mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]'
                                value={formData.asset_status}
                                onChange={handleChange}
                            >
                                 {errors.asset_status && <span className="text-red-500 text-sm mt-1">{errors.asset_status}</span>}
                                <option value="">Select</option>
                                <option value="Assigned">Assigned</option>
                                <option value="UnAssigned">UnAssigned</option>
                            </select>
                        </div>
                        <div className='flex flex-row mt-3 gap-14'>
                            <div className='flex flex-col'>
                                <label className='text-[13px] text-black'>RAM</label>
                                <select 
                                    name="ram"
                                    className='mt-1 p-2 border rounded w-[120px] h-[36px] text-xs text-[#667085]'
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
                                <label className='text-[13px] text-black'>ROM</label>
                                <select 
                                    name="rom"
                                    className='mt-1 p-2 border rounded w-[120px] h-[36px] text-xs text-[#667085]'
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
                            <label className='text-[13px] text-black'>Processor</label>
                            <select 
                                name="processor"
                                className='mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]'
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
                            <label className='text-[13px] text-black'>OS Type</label>
                            <select 
                                name="ostype"
                                className='mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]'
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
                                <label className='text-[13px] text-black'>MS office installed?</label>
                                <select 
                                    name="ms_office_installed"
                                    className='mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]'
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
                            <label className='text-[13px] text-black'>Purchased Date<span className='text-red-500'>*</span></label>
                            <input 
                                name="purchase_date"
                                className='mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]'
                                type='date'
                                value={formData.purchase_date}
                                onChange={handleChange}
                            />
                            {errors.purchase_date && <span className="text-red-500 text-sm mt-1">{errors.purchase_date}</span>}
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[13px] text-black'>Purchased Cost<span className='text-red-500'>*</span></label>
                            <input 
                                name="purchase_cost"
                                className='mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]'
                                value={formData.purchase_cost}
                                onChange={handleChange}
                            />
                              {errors.purchase_cost && <span className="text-red-500 text-sm mt-1">{errors.purchase_cost}</span>}
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[13px] text-black'>Admin Configuration?</label>
                            <select 
                            disabled={formData.asset_type !== 'Laptop'}
                                name="admin_configuration"
                                className='mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]'
                                value={formData.admin_configuration}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[13px] text-black'>Operational Status</label>
                            <select 
                                name="operational_status"
                                className='mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]'
                                value={formData.operational_status}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="In use">In use</option>
                                <option value="Damage">Damage</option>
                            </select>
                        </div>
                        <div className='flex flex-col mt-3'>
                            <label className='text-[13px] text-black'>Comments</label>
                            <input 
                                name="comments"
                                className='mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]'
                                value={formData.comments}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex mt-5 w-full justify-end items-end">
                <button className="px-10 w-[180px] h-[33px] rounded-xs hover:text-[#A6C4F0] hover:bg-[#134572]  bg-[#134572] text-white text-sm">
                        Submit
                    </button>
                    </div>
                    </form>
                </>
            ) : (
                <AssetsHistory />
            )}
        </div>
    );
}

export default AssetsManagement;