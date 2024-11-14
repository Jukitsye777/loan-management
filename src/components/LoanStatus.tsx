import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from './Firebase';

const LoanStatus = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loanData, setLoanData] = useState({
    loanId: '',
    status: '',
    overdueDays: '', // Add overdueDays to loan data
  });
  const [loans, setLoans] = useState([]);
  const [editLoanId, setEditLoanId] = useState(null);

  const [filter, setFilter] = useState({
    loanId: '',
    status: '',
  });

  // Handle input change for loan form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoanData({ ...loanData, [name]: value });
  };

  // Handle form submission for adding or updating a loan
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing loan
        const loanRef = doc(db, "loanstatus", editLoanId);
        await updateDoc(loanRef, loanData);
        alert("Loan updated successfully!");
      } else {
        // Add new loan
        await addDoc(collection(db, "loanstatus"), loanData);
        alert("Loan added successfully!");
      }
      setShowPopup(false); // Close the popup
      setLoanData({
        loanId: '',
        status: '',
        overdueDays: '', // Reset overdueDays
      });
      fetchLoans(); // Refresh the loans list after adding/updating
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save loan.");
    }
    setIsEditing(false); // Reset editing state
  };

  // Fetch and filter loans from Firestore
  const fetchLoans = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "loanstatus"));
      let loansList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Apply filtering based on the input values in the filter state
      loansList = loansList.filter((loan) => {
        return (
          (filter.loanId ? loan.loanId.toString().includes(filter.loanId) : true) &&
          (filter.status ? loan.status.includes(filter.status) : true)
        );
      });

      setLoans(loansList);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  useEffect(() => {
    fetchLoans(); // Load loans when the component mounts or filter changes
  }, [filter]); // Re-fetch when filter changes

  // Handle filter input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  // Open popup for editing a loan
  const handleEdit = (loan) => {
    setEditLoanId(loan.id);
    setLoanData({
      loanId: loan.loanId,
      status: loan.status,
      overdueDays: loan.overdueDays || '', // Pre-fill the overdueDays for editing
    });
    setIsEditing(true);
    setShowPopup(true);
  };

  // Delete a loan from Firestore and UI
  const handleDelete = async (loanId) => {
    try {
      const loanRef = doc(db, "loanstatus", loanId);
      await deleteDoc(loanRef);
      setLoans(loans.filter(loan => loan.id !== loanId));
      alert("Loan deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete loan.");
    }
  };

  return (
    <div className='flex flex-col items-center w-full p-4'>
      <div className='flex flex-row justify-between w-full max-w-4xl'>
        <h1 className='text-brown text-2xl font-bold'>Loan Status</h1>
        <div className='flex space-x-2'>
          <button 
            className='bg-brown text-white rounded-lg w-40 py-2 flex items-center justify-center' 
            onClick={() => {
              setShowPopup(true);
              setIsEditing(false);
              setLoanData({
                loanId: '',
                status: '',
                overdueDays: '', // Reset overdueDays
              });
            }}
          >
            Add Loan
          </button>
          <button 
            className='bg-gray-500 text-white rounded-lg w-40 py-2 flex items-center justify-center' 
            onClick={() => setShowPopup(true)}
          >
            Filter
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            {/* Table header */}
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Loan ID</th>
                <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Status</th>
                <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Overdue Days</th> {/* New column */}
                <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className="even:bg-gray-100">
                  <td className="py-2 px-4 border-b text-gray-600">{loan.loanId}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{loan.status}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{loan.overdueDays || 'N/A'}</td> {/* Show overdueDays */}
                  <td className="py-2 px-4 border-b text-gray-600">
                    <button 
                      className="text-blue-500 hover:underline" 
                      onClick={() => handleEdit(loan)}
                    >
                      Edit
                    </button> | 
                    <button 
                      className="text-red-500 hover:underline" 
                      onClick={() => handleDelete(loan.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup form for add/edit */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Loan" : "Add New Loan"}</h2>
            <form onSubmit={handleSubmit}>
              <input 
                type="number" 
                name="loanId" 
                placeholder="Loan ID" 
                value={loanData.loanId} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
              />
              <select 
                name="status" 
                value={loanData.status} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="overdue">Overdue</option>
                <option value="paid">Paid</option>
              </select>
              <input 
                type="number" 
                name="overdueDays" 
                placeholder="Overdue Days" 
                value={loanData.overdueDays} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
              />
              <div className="flex justify-end mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowPopup(false)} 
                  className="text-gray-500 mr-4"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                >
                  {isEditing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanStatus;
