import React, { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { returnAccessCard } from '../../actions/assetApi';

const AccessModal = ({ employee, onClose, onReturn}) => {
  const [returnDate, setReturnDate] = useState('');
  const [error, setError] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleReturn = async () => {
    if (!returnDate) {
      setError('Please select a return date');
      return;
    }

    try {
      // Call the returnAccessCard API and pass access_card_id as param, returnDate in body
      const result = await returnAccessCard(employee.access_card_id, returnDate);
      if (result) {
        onReturn(employee.access_card_id, returnDate);
        onClose();
      } else {
        alert('Failed to return the access card.');
      }
    } catch (error) {
      console.error('Error returning the access card:', error);
    }
  }; 

  const handleReturnDateChange = (e) => {
    setReturnDate(e.target.value);
    if (e.target.value) {
      setError(''); // Clear the error if a valid return date is entered
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 z-40" aria-hidden="true" onClick={onClose}></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 text-lg border border-red-500 rounded-full"
        >
          <IoIosClose />
        </button>
        <h2 className="font-semibold mb-4 text-sm">Employee Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700">Employee Name</label>
            <Input className="h-7 text-xs" value={employee.emp_name || ''} readOnly />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Employee ID</label>
            <Input className="h-7 text-xs" value={employee.emp_id || ''} readOnly />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Access Card no</label>
            <Input className="h-7 text-xs" value={employee.access_card_number || ''} readOnly />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Role</label>
            <Input className="h-7 text-xs" value={employee.role || ''} readOnly />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Issue Date</label>
            <Input className="h-7 text-xs" value={formatDate(employee.issue_date)}  readOnly />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Return Date</label>
            <Input 
              className="h-7 text-xs" 
              type="date" 
              value={returnDate} 
              onChange={handleReturnDateChange} 
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <Button className="bg-[#134572] px-4 h-8 text-white text-xs" onClick={handleReturn}>
              Return
            </Button>
            <Button className="bg-[#134572] text-xs px-3 h-8" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessModal;