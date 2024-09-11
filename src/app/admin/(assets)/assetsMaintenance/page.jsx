"use client";
import React, { useState } from 'react';
import { postAssetForMaintenance } from '../../../../actions/assetApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssetsMaintenanceHistory from '../assetsMaintenanceHistory/page'

const AssetsMaintenanceManagement = () => {
  const [activeTab, setActiveTab] = useState('maintenance');
  const [formData, setFormData] = useState({
    asset_no: '',
    issue_description: '',
    service_cost: '',
    service_outdate: '',
    service_indate: '',
    comments: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value.trimStart()
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const validateForm = () => {
    for (let key in formData) {
      if (!formData[key] || formData[key].trim() === "") {
        toast.error("All fields are required and must not be empty or contain only spaces.");
        return false;
      }
    }

    if (formData.service_cost.length > 9) {
      toast.error("Service cost should not exceed 9 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formattedFormData = {
      ...formData,
      service_indate: formatDate(formData.service_indate),
      service_outdate: formatDate(formData.service_outdate),
      service_cost: parseInt(formData.service_cost, 10)
    };

    const response = await postAssetForMaintenance(formattedFormData);

    if (response.statusCode === 201) {
      setFormData({
        asset_no: '',
        issue_description: '',
        service_cost: '',
        service_outdate: '',
        service_indate: '',
        comments: ''
      });
      toast.success("Asset maintenance record created successfully");
    } else {
      toast.error(response.error || response.resmessage);
    }
  };

  return (
    <div className="w-full h-screen bg-white p-6">
      <ToastContainer />
      <div className="flex mb-4 bg-gray-100">
    <button
        className={`mr-4 w-[50%] px-4 py-2 border-b-4 text-sm transition-all duration-200 ${activeTab === 'maintenance' ? 'border-[#134572] text-[#134572]' : 'border-transparent text-black'}`}
        onClick={() => setActiveTab('maintenance')}
        style={{ transformOrigin: 'right' }}
    >
         Assets Maintenance 
    </button>
    <button
        className={`px-4 py-2 w-[50%] border-b-4 text-sm transition-all duration-200 ${activeTab === 'history' ? 'border-[#134572] text-[#134572]' : 'border-transparent text-black'}`}
        onClick={() => setActiveTab('history')}
        style={{ transformOrigin: 'left' }}
    >
        Maintenance Details
    </button>
</div>

      {activeTab === 'maintenance' ? (
        <>
          <form onSubmit={handleSubmit}>
            <div className="w-full h-full flex">
              <div className="h-full w-1/2">
                <div className="flex flex-col mt-12">
                  <label className="text-[13px] text-black ml-3">Asset No</label>
                  <input
                    name="asset_no"
                    value={formData.asset_no}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded min-w-[356px] w-[420px] h-[38px] text-[#667085]"
                    minLength={2}
                    maxLength={10}
                  />
                </div>
                <div className="flex flex-col mt-8">
                  <label className="text-[13px] text-black ml-3">Issue Description</label>
                  <input
                    name="issue_description"
                    value={formData.issue_description}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded min-w-[356px] w-[420px] h-[38px] text-[#667085]"
                    minLength={4}
                    maxLength={50}
                  />
                </div>
                <div className="flex flex-col mt-8">
                  <label className="text-[13px] text-black ml-3">Service Cost</label>
                  <input
                    name="service_cost"
                    type="number"
                    value={formData.service_cost}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded min-w-[356px] w-[420px] h-[38px] text-[#667085]"
                    minLength={1}
                    maxLength={9}
                  />
                </div>
              </div>
              <div className='h-full w-1/2'>
                <div className="flex flex-col mt-12">
                  <label className="text-[13px] text-black ml-3">Service Initiated</label>
                  <input
                    name="service_indate"
                    type="date"
                    value={formData.service_indate}
                    onChange={handleChange}
                    className="mt-1 p-2 border text-xs rounded min-w-[356px] w-[420px] h-[38px] text-[#667085]"
                  />
                </div>
                <div className="flex flex-col mt-8">
                  <label className="text-[13px] text-black ml-3">Service Completed</label>
                  <input
                    name="service_outdate"
                    type="date"
                    value={formData.service_outdate}
                    onChange={handleChange}
                    className="mt-1 p-2 border text-xs rounded min-w-[356px] w-[420px] h-[38px] text-[#667085]"
                  />
                </div>
                <div className="flex flex-col mt-10">
                  <label className="text-[13px] text-black ml-3">Comments</label>
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
                className="px-10  w-[180px] h-[33px] hover:text-[#A6C4F0] hover:bg-[#134572]  mr-14 rounded-xs bg-[#134572] text-white text-sm"
              >
                Submit
              </button>
            </div>
          </form>
        </>
      ) : (
        <AssetsMaintenanceHistory />
      )}
    </div>
  );
};

export default AssetsMaintenanceManagement;