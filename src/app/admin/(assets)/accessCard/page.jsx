"use client"
import React, { useEffect, useState } from 'react';
import { getallemp } from '../../../../actions';
import { postAccessCardDetails, getAllAccessCardDetails } from '../../../../actions/assetApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccessCardHistory from '../accessCardHistory/page';

const AccessCardManagement = () => {
  const [activeTab, setActiveTab] = useState('registration');
  const [formData, setFormData] = useState({
    card_type: '',
    emp_name: '',
    emp_id: '',
    designation: '',
    role: '',
    access_card_number: '',
    issue_date: '',
    comments: '',
    user_id: '',
    
  });

  const [employeeData, setEmployeeData] = useState([]);
  const [accessCardData, setAccessCardData] = useState([]);
  const [isIssueDateDisabled, setIsIssueDateDisabled] = useState(false);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const employees = await getallemp();
        setEmployeeData(employees);
        const accessCardDetails = await getAllAccessCardDetails();
        setAccessCardData(accessCardDetails.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again later.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    
    if (name === 'card_type') {
      setFormData({
        card_type: value,
        emp_name: '',
        emp_id: '',
        designation: '',
        role: '',
        access_card_number: '',
        issue_date: '',
        comments: '',
        user_id: '',
      
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '', 
    }));
  };

  const formatDate = (date) => {
    if (!date) return ''; 
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? '' : parsedDate.toISOString().split('T')[0]; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.card_type || formData.card_type === "select") {
      newErrors.card_type = "Card Type is required.";
    }
    if (!formData.emp_name) {
      newErrors.emp_name = formData.card_type === 'visitor card' ? "Visitor Name is required." : "Employee Name is required.";
    }
    if (!formData.role) {
      newErrors.role = "Role is required.";
    }
    if (!formData.access_card_number) {
      newErrors.access_card_number = "Access Card Number is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let existingCard = null;
    if (formData.emp_id) {
      existingCard = accessCardData.find(card => card.emp_id === formData.emp_id);
    }
    
    if (existingCard) {
      toast.error(formData.card_type === 'visitor card' ? "Visitor already has an existing Access card" : "Employee already has an existing Access card");
      return;
    }

    const formattedData = {
      ...formData,
      issue_date: formatDate(formData.issue_date),
    };

    const response = await postAccessCardDetails(formattedData);

    if (response.statusCode === 201) {
      setFormData({
        card_type: '',
        emp_name: '',
        emp_id: '',
        designation: '',
        role: '',
        access_card_number: '',
        issue_date: '',
        comments: '',
        user_id: '',
      });
      setAccessCardData([...accessCardData, formattedData]);
      toast.success("Access card created successfully");
    
    } else {
      toast.error(response.resmessage);
    }
  };

  return (
    <div className="w-full h-screen bg-white p-6">
      <ToastContainer />
      <div className="flex mb-4 bg-gray-100">
        <button
          className={`mr-4 w-[50%] px-4 py-2 border-b-4 text-sm transition-all duration-200 ${activeTab === 'registration' ? 'border-[#134572] text-[#134572]' : 'border-transparent text-black'}`}
          onClick={() => setActiveTab('registration')}
          style={{ transformOrigin: 'right' }}
        >
          Access Card Registration 
        </button>
        <button
          className={`px-4 py-2 w-[50%] border-b-4 text-sm transition-all duration-200 ${activeTab === 'history' ? 'border-[#134572] text-[#134572]' : 'border-transparent text-black'}`}
          onClick={() => setActiveTab('history')}
          style={{ transformOrigin: 'left' }}
        >
          Access Card Details
        </button>
      </div>
      {activeTab === 'registration' ? (
        <>
          <div className="mt-8">
            <form onSubmit={handleSubmit}>
              <div className="w-full h-full flex flex-wrap lg:flex-nowrap gap-4">
                {/* First Half */}
                <div className="h-full w-full lg:w-1/2 gap-4">
                  {/* Card Type */}
                  <div className="flex flex-col">
                    <label className="text-[13px] text-black ml-3">Card Type<span className='text-red-500'>*</span></label>
                    <select
                      name="card_type"
                      className="mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]"
                      value={formData.card_type}
                      onChange={handleChange}
                    >
                      <option value="select">Select</option>
                      <option value="id card">ID Card</option>
                      <option value="visitor card">Visitor Card</option>
                    </select>
                    {errors.card_type && <span className="text-red-500 text-sm mt-1">{errors.card_type}</span>}
                  </div>

                  {/* Employee/Visitor Name */}
                  <div className="flex flex-col mt-6">
                    <label className="text-[13px] text-black ml-3">
                      {formData.card_type === 'visitor card' ? 'Visitor Name' : 'Employee Name'}<span className='text-red-500'>*</span>
                    </label>
                    {formData.card_type === 'id card' ? (
                      <select
                        name="emp_name"
                        className="mt-1 p-2 text-xs border min-w-[250px] w-[300px] h-[36px] rounded text-[#667085]"
                        value={`${formData.emp_name} (${formData.emp_id})`}
                        onChange={(e) => {
                          const [emp_name, emp_id] = e.target.value.split(' (');
                          const selectedEmp = employeeData.find(emp => emp.emp_id === emp_id.slice(0, -1));
                          setFormData((prevData) => ({
                            ...prevData,
                            emp_name: emp_name,
                            emp_id: emp_id.slice(0, -1),
                            user_id: selectedEmp?.user_id || '',
                          }));
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            emp_name: '',
                          }));
                        }}
                      >
                        <option value="">Select</option>
                        {employeeData.map(emp => (
                          <option key={emp.emp_id} value={`${emp.emp_name} (${emp.emp_id})`}>
                            {emp.emp_name} ({emp.emp_id})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        name="emp_name"
                        className="mt-2 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]"
                        placeholder={formData.card_type === 'visitor card' ? "Enter visitor name" : "Enter name"}
                        value={formData.emp_name}
                        onChange={handleChange}
                      />
                    )}
                    {errors.emp_name && <span className="text-red-500 text-sm mt-1">{errors.emp_name}</span>}
                  </div>

                  {/* Employee/Visitor ID */}
                  <div className="flex flex-col mt-6">
                    <label className="text-[13px] text-black ml-3">
                      {formData.card_type === 'visitor card' ? 'Visitor ID' : 'Employee ID'}
                    </label>
                    <input
                      name="emp_id"
                      className="mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]"
                      value={formData.emp_id}
                      onChange={handleChange}
                      readOnly={formData.card_type === 'id card'}
                      placeholder={formData.card_type === 'visitor card' ? "Enter visitor ID" : ""}
                    />
                  </div>

                  {/* Designation */}
                  <div className="flex flex-col mt-6">
                    <label className="text-[13px] text-black ml-3">Designation</label>
                    <select
                      name="designation"
                      className="mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]"
                      value={formData.designation}
                      onChange={handleChange}
                      disabled={formData.card_type === 'visitor card'}
                    >
                      <option>Select</option>
                      <option value="software_developer">Software Developer</option>
                      <option value="software_testing">Software Testing</option>
                      <option value="human_resource">Human Resource</option>
                      <option value="data_engineer/AI">Data Engineer/AI</option>
                    </select>
                  </div>
                </div>

                {/* Second Half */}
                <div className="h-full w-full lg:w-1/2 mt-8 lg:mt-0">
                  {/* Role */}
                  <div className="flex flex-col">
                    <label className="text-[13px] text-black ml-3">Role</label>
                    <select
                      name="role"
                      className="mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option>Select</option>
                      <option value="consultant">Consultant</option>
                      <option value="employee">Employee</option>
                      <option value="intern">Intern</option>
                      <option value="contractor">Contractor</option>
                      <option value="visitor">Visitor</option>
                      <option value="client">Client</option>
                      <option value="vendor">Vendor</option>
                    </select>
                  </div>

                  {/* Access Card No */}
                  <div className="flex flex-col mt-6">
                    <label className="text-[13px] text-black ml-3">Access Card No<span className='text-red-500'>*</span></label>
                    <input
                      name="access_card_number"
                      className="mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]"
                      value={formData.access_card_number}
                      onChange={handleChange}
                    />
                    {errors.access_card_number && <span className="text-red-500 text-sm mt-1">{errors.access_card_number}</span>}
                  </div>

                  {/* Dates */}
                  <div className="flex flex-col mt-6 gap-6">
                    <div className="flex gap-6 w-[370px]">
                      <div className="flex flex-col w-1/2">
                        <label className="text-[13px] text-black">Issue Date</label>
                        <input
                          name="issue_date"
                          className="mt-1 p-2 border rounded w-[300px] text-xs text-[#667085] mr-5"
                          type="date"
                          value={formData.issue_date}
                          onChange={handleChange}
                          disabled={isIssueDateDisabled}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="flex flex-col mt-6">
                    <label className="text-[13px] text-black ml-3">Comments</label>
                    <input
                      name="comments"
                      className="mt-1 p-2 border rounded min-w-[250px] w-[300px] h-[36px] text-xs text-[#667085]"
                      value={formData.comments}
                      onChange={handleChange}
                      minLength={5}
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>

              <div className="flex mt-4 w-full items-end justify-end ">
                <button
                  type="submit"
                  className="px-10 ml-16 w-[180px] h-[33px] hover:text-[#A6C4F0] hover:bg-[#134572] rounded-xs bg-[#134572] text-white text-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <AccessCardHistory />
      )}
    </div>
  );
};

export default AccessCardManagement;