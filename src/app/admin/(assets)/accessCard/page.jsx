"use client"
import React, { useEffect, useState } from 'react';
import { getallemp } from '../../../../actions';
import { postAccessCardDetails } from '../../../../actions/assetApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCircle } from 'react-icons/fa';

const AccessCard = () => {
  const [formData, setFormData] = useState({
    card_type: '',
    emp_name: '',
    emp_id: '',
    designation: '',
    role: '',
    access_card_number: '',
    issue_date: '',
    return_date: '',
    comments: '',
    user_id: '',
    isOthers: false,
  });

  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const employees = await getallemp();
      setEmployeeData(employees);
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check if the card_type dropdown is being changed
    if (name === 'card_type') {
      // Reset form data when card type changes
      setFormData({
        card_type: value,
        emp_name: '',
        emp_id: '',
        designation: '',
        role: '',
        access_card_number: '',
        issue_date: '',
        return_date: '',
        comments: '',
        user_id: '',
        isOthers: false,
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      issue_date: formatDate(formData.issue_date),
      return_date: formatDate(formData.return_date),
    };

    // Adjust data based on whether 'Others' is selected
    if (formData.isOthers) {
      const { isOthers, ...rest } = formattedData; // Remove emp_id
      const response = await postAccessCardDetails(rest);
      if (response.statusCode === 201) {
        toast.success("Access card created successfully");
      } else {
        toast.error(response.resmessage);
      }
    } else {
      const { isOthers, ...allData } = formattedData;
      const response = await postAccessCardDetails(allData);
      if (response.statusCode === 201) {
        setFormData({
          card_type: '',
          emp_name: '',
          emp_id: '',
          designation: '',
          role: '',
          access_card_number: '',
          issue_date: '',
          return_date: '',
          comments: '',
          user_id: '',
          isOthers: false,
        });
        toast.success("Access card created successfully");
      } else {
        toast.error(response.resmessage);
      }
    }
  };

  const toggleOthers = () => {
    setFormData((prevData) => ({
      ...prevData,
      isOthers: !prevData.isOthers,
      emp_name: '',
      emp_id: '',
      user_id: '',
      designation: prevData.isOthers ? '' : prevData.designation,
      role: prevData.isOthers ? '' : prevData.role,
    }));
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <ToastContainer />
      <div>
        <p className="text-[25px] font-inter">Access Card</p>
      </div>
      <div className="mt-8">
        <form onSubmit={handleSubmit}>
          <div className="w-full h-full flex flex-wrap lg:flex-nowrap gap-4">
            {/* First Half */}
            <div className="h-full w-full lg:w-1/2 gap-4">
              {/* Card Type */}
              <div className="flex flex-col">
                <label className="text-[16px] text-black ml-3">Card Type</label>
                <select
                  name="card_type"
                  className="mt-1 p-2 border rounded w-[350px] text-[#667085]"
                  value={formData.card_type}
                  onChange={handleChange}
                >
                  <option>Select</option>
                  <option value="id card">ID Card</option>
                  <option value="visitor card">Visitor Card</option>
                </select>
              </div>

              {/* Employee Name */}
              <div className="flex flex-col mt-6">
                <div className="flex items-center">
                  <label className="text-[16px] text-black ml-3 w-[350px] flex items-center">
                    <span>Employee Name</span>
                    <FaCircle
                      className={`ml-2 cursor-pointer ${formData.isOthers ? 'text-[#134572]' : 'text-gray-300'}`}
                      onClick={toggleOthers}
                    />
                    <span className="ml-2 text-sm">Others</span>
                  </label>
                </div>
                {formData.isOthers ? (
                  <input
                    name="emp_name"
                    className="mt-2 p-2 border rounded w-[350px] text-[#667085]"
                    placeholder="Enter name"
                    value={formData.emp_name}
                    onChange={handleChange}
                  />
                ) : (
                  <select
                    name="emp_name"
                    className="mt-1 p-2 border rounded w-[350px] text-[#667085]"
                    value={`${formData.emp_name} (${formData.emp_id})`}
                    onChange={(e) => {
                      const [emp_name, emp_id] = e.target.value.split(' (');
                      const selectedEmp = employeeData.find(emp => emp.emp_id === emp_id.slice(0, -1));
                      setFormData({
                        ...formData,
                        emp_name: emp_name,
                        emp_id: emp_id.slice(0, -1),
                        user_id: selectedEmp?.user_id || '',
                      });
                    }}
                  >
                    <option value="">Select</option>
                    {employeeData.map(emp => (
                      <option key={emp.emp_id} value={`${emp.emp_name} (${emp.emp_id})`}>
                        {emp.emp_name} ({emp.emp_id})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Employee ID */}
              {!formData.isOthers && (
                <div className="flex flex-col mt-6">
                  <label className="text-[16px] text-black ml-3">Employee ID</label>
                  <input
                    name="emp_id"
                    className="mt-1 p-2 border rounded w-[350px] text-[#667085]"
                    value={formData.emp_id}
                    readOnly
                  />
                </div>
              )}

              {/* Designation */}
              <div className="flex flex-col mt-6">
                <label className="text-[16px] text-black ml-3">Designation</label>
                <select
                  name="designation"
                  className="mt-1 p-2 border rounded w-[350px] text-[#667085]"
                  value={formData.designation}
                  onChange={handleChange}
                  disabled={formData.isOthers}
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
                <label className="text-[16px] text-black ml-3">Role</label>
                <select
                  name="role"
                  className="mt-1 p-2 border rounded w-[350px] text-[#667085]"
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
                <label className="text-[16px] text-black ml-3">Access Card No</label>
                <input
                  name="access_card_number"
                  className="mt-1 p-2 border rounded w-[350px] text-[#667085]"
                  value={formData.access_card_number}
                  onChange={handleChange}
                />
              </div>

              {/* Dates */}
              <div className="flex flex-col mt-6 gap-6">
                <div className="flex gap-6 w-[370px]">
                  <div className="flex flex-col w-1/2">
                    <label className="text-[16px] text-black">Issue Date</label>
                    <input
                      name="issue_date"
                      className="mt-1 p-2 border rounded w-[150px] text-[#667085]"
                      type="date"
                      value={formData.issue_date}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label className="text-[16px] text-black">Return Date</label>
                    <input
                      name="return_date"
                      className="mt-1 p-2 border rounded w-[150px] text-[#667085]"
                      type="date"
                      value={formData.return_date}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Command */}
              <div className="flex flex-col mt-6">
                <label className="text-[16px] text-black ml-3">Comments</label>
                <input
                  name="comments"
                  className="mt-1 p-2 border rounded w-[350px] text-[#667085]"
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
              className="px-10 ml-16 w-[200px] h-[35px] rounded-xs bg-[#134572] text-white text-lg"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccessCard;
