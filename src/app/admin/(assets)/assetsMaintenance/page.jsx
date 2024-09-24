"use client"
import React, { useState, useEffect } from 'react';
import { postAssetForMaintenance, getAllAssets,updateAssetForMaintenance,getAllAssetsForMaintenance } from '../../../../actions/assetApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssetsMaintenanceHistory from '../assetsMaintenanceHistory/page';

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

  const [assets, setAssets] = useState([]);
  const [maintenanceAssets, setMaintenanceAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [employeeName, setEmployeeName] = useState('');
  const [serviceCostError, setServiceCostError] = useState('');


  const fetchAssetsForMaintenance = async () => {
    try {
      const response = await getAllAssetsForMaintenance();
      
      if (response) {
        setMaintenanceAssets(response.data);
      } else {
        toast.error("Failed to fetch maintenance assets");
      }
    } catch (error) {
      console.error("Error fetching maintenance assets:", error);
      toast.error("An error occurred while fetching maintenance assets");
    }
  };

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await getAllAssets();
        if (response) {
          setAssets(response);
        } else {
          toast.error("Failed to fetch assets");
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
        toast.error("An error occurred while fetching assets");
      }
    };

    fetchAssets();
    fetchAssetsForMaintenance();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'service_cost' && value && !/^\d*$/.test(value)) {
      // If input is not a number, set error message
      setServiceCostError("Service cost must be a numeric value.");
    } else {
      // Reset error if input is valid
      setServiceCostError('');
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: value.trimStart()
    }));

    if (name === 'asset_no') {
      const asset = assets.find(a => a.asset_no === value);
      setSelectedAsset(asset);
      if (asset && asset.asset_status === 1) {
        setEmployeeName(asset.emp_name || '');
      } else {
        setEmployeeName('');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return ''; 
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const validateForm = () => {
    if (!formData.asset_no || formData.asset_no.trim() === "") {
      toast.error("Asset number is required.");
      return false;
    }
    if (!formData.issue_description || formData.issue_description.trim() === "") {
      toast.error("Issue description is required.");
      return false;
    }
    if (!formData.service_indate) {
      toast.error("Service initiated date is required.");
      return false;
    }
    
    if (formData.service_cost) {
      if (!/^\d+$/.test(formData.service_cost)) {
        toast.error("Service cost must be a numeric value.");
        return false;
      }
      if (formData.service_cost.length > 9) {
        toast.error("Service cost should not exceed 9 digits.");
        return false;
      }
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
      service_cost: formData.service_cost ? parseInt(formData.service_cost, 10) : null,
      emp_name: employeeName
    };
    console.log("existingmaintaneasset",maintenanceAssets);
    console.log("formdata_Asset_no",formData.asset_no);
    const existingMaintenanceAsset = maintenanceAssets.find(
      (asset) => asset.asset_no === formData.asset_no && asset.service_outdate === null
    );
    console.log("existingMaintenanceAsset",existingMaintenanceAsset);

    if (existingMaintenanceAsset) {
      // If the asset exists, update the asset maintenance record
      const response = await updateAssetForMaintenance(existingMaintenanceAsset.asset_service_id, formattedFormData);

      if (response.statusCode === 200) {
        toast.success("Asset maintenance record updated successfully");
        setFormData({
          asset_no: '',
          issue_description: '',
          service_cost: '',
          service_outdate: '',
          service_indate: '',
          comments: ''
        });
        setSelectedAsset(null);
        setEmployeeName('');
        await fetchAssetsForMaintenance();
      } else {
        toast.error(response.error || response.resmessage);
      }
    } else {
      // If the asset does not exist, create a new asset maintenance record
      const response = await postAssetForMaintenance(formattedFormData);

      if (response.statusCode === 201) {
        toast.success("Asset maintenance record created successfully");
        setFormData({
          asset_no: '',
          issue_description: '',
          service_cost: '',
          service_outdate: '',
          service_indate: '',
          comments: ''
        });
        setSelectedAsset(null);
        setEmployeeName('');
        await fetchAssetsForMaintenance();
       
      } else {
        toast.error(response.error || response.resmessage);
      }
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
                  <label className="text-[13px] text-black ml-3">Asset No<span className="text-red-500">*</span></label>
                  <select
                    name="asset_no"
                    value={formData.asset_no}
                    onChange={handleChange}
                    className="mt-1 p-2  border rounded min-w-[356px] w-[420px] h-[38px] text-[#667085] text-sm"
                    required
                  >
                    <option value="" className='text-sm'>select</option>
                    {assets.map((asset) => (
                      <option key={asset.asset_no} value={asset.asset_no} className='text-sm'>
                        {asset.asset_no}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedAsset && selectedAsset.asset_status === '1' && (
                  <div className="flex flex-col mt-4">
                    <label className="text-[13px] text-black ml-3">Name</label>
                    <input
                      type="text"
                      value={employeeName}
                      className="mt-1 p-2 border rounded min-w-[356px] w-[420px] h-[38px] text-[#667085]"
                      readOnly
                    />
                  </div>
                )}
                <div className="flex flex-col mt-8">
                  <label className="text-[13px] text-black ml-3">Issue Description<span className="text-red-500">*</span></label>
                  <input
                    name="issue_description"
                    value={formData.issue_description}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded min-w-[356px] w-[420px] h-[38px] text-[#667085]"
                    minLength={4}
                    maxLength={50}
                    required
                  />
                </div>
                <div className="flex flex-col mt-8">
                  <label className="text-[13px] text-black ml-3">Service Cost</label>
                  <input
                    name="service_cost"
                    type="text"
                    value={formData.service_cost}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded min-w-[356px] w-[420px] h-[38px] text-[#667085]"
                    minLength={1}
                    maxLength={9}
                  />
                  {serviceCostError && (
                  <span className="text-red-500 text-sm">{serviceCostError}</span>
                )}
                </div>
              </div>
              <div className='h-full w-1/2'>
                <div className="flex flex-col mt-12">
                  <label className="text-[13px] text-black ml-3">Service Initiated<span className="text-red-500">*</span></label>
                  <input
                    name="service_indate"
                    type="date"
                    value={formData.service_indate}
                    onChange={handleChange}
                    className="mt-1 p-2 border text-xs rounded min-w-[356px] w-[420px] h-[38px] text-[#667085]"
                    required
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
                className="px-10 w-[180px] h-[33px] hover:text-[#A6C4F0] hover:bg-[#134572] mr-14 rounded-xs bg-[#134572] text-white text-sm"
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