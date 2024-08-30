"use client";
import React, { useState } from 'react';
import { postAssetForMaintenance } from '../../../../actions/assetApi'; // Import your API function
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssetsMaintenance = () => {
  const [formData, setFormData] = useState({
    asset_no: '',
    issue_description: '',
    service_cost: '',
    service_outdate: '',
    service_indate: '',
    comments:'',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent leading and trailing spaces
    setFormData(prevState => ({
      ...prevState,
      [name]: value.trimStart() // Remove leading spaces
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const validateForm = () => {
    // Ensure no field is empty or contains only spaces
    for (let key in formData) {
      if (!formData[key] || formData[key].trim() === "") {
        toast.error("All fields are required and must not be empty or contain only spaces.");
        return false;
      }
    }

    // Validate service cost length (max 9 digits)
    if (formData.service_cost.length > 9) {
      toast.error("Service cost should not exceed 9 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) return;

    const formattedFormData = {
      ...formData,
      service_indate: formatDate(formData.service_indate),
      service_outdate: formatDate(formData.service_outdate),
      service_cost: parseInt(formData.service_cost, 10) // Convert to integer
    };

    // Call your API function with the formatted data
    const response = await postAssetForMaintenance(formattedFormData);

    if (response.statusCode === 201) {
      setFormData({asset_no: '',
        issue_description: '',
        service_cost: '',
        service_outdate: '',
        service_indate: '',
        comments:''})
      toast.success("Access card created successfully");
      console.log('Access card created successfully:', response.resmessage);
    } else {
      toast.error(response.error || response.resmessage);
      console.error('Error creating access card:', response.error || response.resmessage);
    }
  };

  return (
    <div>
      <div className="w-full h-full bg-white p-6">
        <ToastContainer />
        <div>
          <p className="text-[25px] font-inter">Assets Maintenance</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="w-full h-full flex">
            <div className="h-full w-1/2">
              <div className="flex flex-col mt-14">
                <label className="text-[16px] text-black ml-3">Asset No</label>
                <input
                  name="asset_no"
                  value={formData.asset_no}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded min-w-[356px] w-[420px] h-[38px] text-[#667085]"
                  minLength={2}
                  maxLength={10}
                />
              </div>
              <div className="flex flex-col mt-14">
                <label className="text-[16px] text-black ml-3">Issue Description</label>
                <input
                  name="issue_description"
                  value={formData.issue_description}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded min-w-[356px] w-[420px] h-[38px] text-[#667085]"
                  minLength={4}
                  maxLength={50}
                />
              </div>
              <div className="flex flex-col mt-14">
                <label className="text-[16px] text-black ml-3">Service Cost</label>
                <input
                  name="service_cost"
                  type="number"
                  value={formData.service_cost}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded min-w-[356px] w-[420px] h-[38px] text-[#667085]"
                  minLength={1}
                  maxLength={9} // Prevent more than 9 digits
                />
              </div>
            </div>
            <div className='h-full w-1/2'>
              <div className="flex flex-col mt-14">
                <label className="text-[16px] text-black ml-3">Service Initiated</label>
                <input
                  name="service_indate"
                  type="date"
                  value={formData.service_indate}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded min-w-[356px] w-[420px] h-[38px] text-[#667085]"
                />
              </div>
              <div className="flex flex-col mt-14">
                <label className="text-[16px] text-black ml-3">Service Completed</label>
                <input
                  name="service_outdate"
                  type="date"
                  value={formData.service_outdate}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded min-w-[356px] w-[420px] h-[38px] text-[#667085]"
                />
              </div>
              <div className="flex flex-col mt-14">
                <label className="text-[16px] text-black ml-3">Comments</label>
                <input
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded min-w-[356px] w-[420px] h-[38px] text-[#667085]"
                  minLength={5}
                  maxLength={50}
                />
              </div>
            </div>
          </div>
          <div className="flex mt-14 w-full justify-end items-end">
            <button
              type="submit"
              className="px-10 w-[200px] h-[35px] mr-14 rounded-xs bg-[#134572] text-white text-lg"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetsMaintenance;
