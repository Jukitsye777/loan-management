import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from './Firebase';

const Repayments = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [repaymentData, setRepaymentData] = useState({
    repaymentId: '',
    loanId: '',
    customerId: '',
    paymentDate: '',
    amountPaid: '',
    remainingBalance: ''
  });
  const [repayments, setRepayments] = useState([]);
  const [editRepaymentId, setEditRepaymentId] = useState(null);

  const [filter, setFilter] = useState({
    loanId: '',
    repaymentId: '',
    paymentDate: '',
  });

  // Handle input change for repayment form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRepaymentData({ ...repaymentData, [name]: value });
  };

  // Handle form submission for adding or updating a repayment
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing repayment
        const repaymentRef = doc(db, "repayments", editRepaymentId);
        await updateDoc(repaymentRef, repaymentData);
        alert("Repayment updated successfully!");
      } else {
        // Add new repayment
        await addDoc(collection(db, "repayments"), repaymentData);
        alert("Repayment added successfully!");
      }
      setShowPopup(false); // Close the popup
      setRepaymentData({
        repaymentId: '',
        loanId: '',
        customerId: '',
        paymentDate: '',
        amountPaid: '',
        remainingBalance: ''
      });
      fetchRepayments(); // Refresh the repayments list after adding/updating
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save repayment.");
    }
    setIsEditing(false); // Reset editing state
  };

  // Fetch and filter repayments from Firestore
  const fetchRepayments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "repayments"));
      let repaymentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Apply filtering based on the input values in the filter state
      repaymentsList = repaymentsList.filter((repayment) => {
        return (
          (filter.loanId ? repayment.loanId.includes(filter.loanId) : true) &&
          (filter.repaymentId ? repayment.repaymentId.includes(filter.repaymentId) : true) &&
          (filter.paymentDate ? repayment.paymentDate.includes(filter.paymentDate) : true)
        );
      });

      setRepayments(repaymentsList);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  useEffect(() => {
    fetchRepayments(); // Load repayments when the component mounts or filter changes
  }, [filter]); // Re-fetch when filter changes

  // Handle filter input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  // Open popup for editing a repayment
  const handleEdit = (repayment) => {
    setEditRepaymentId(repayment.id);
    setRepaymentData({
      repaymentId: repayment.repaymentId,
      loanId: repayment.loanId,
      customerId: repayment.customerId,
      paymentDate: repayment.paymentDate,
      amountPaid: repayment.amountPaid,
      remainingBalance: repayment.remainingBalance
    });
    setIsEditing(true);
    setShowPopup(true);
  };

  // Delete a repayment from Firestore and UI
  const handleDelete = async (repaymentId) => {
    try {
      // Delete repayment from Firestore
      const repaymentRef = doc(db, "repayments", repaymentId);
      await deleteDoc(repaymentRef);
      
      // Remove the repayment from the UI (state)
      setRepayments(repayments.filter(repayment => repayment.id !== repaymentId));
      
      alert("Repayment deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete repayment.");
    }
  };

  return (
    <div className='flex flex-col items-center w-full p-4'>
      <div className='flex flex-row justify-between w-full max-w-4xl'>
        <h1 className='text-brown text-2xl font-bold'>Repayments</h1>
        <div className='flex space-x-2'>
          <button 
            className='bg-brown text-white rounded-lg w-40 py-2 flex items-center justify-center' 
            onClick={() => {
              setShowPopup(true);
              setIsEditing(false);
              setRepaymentData({
                repaymentId: '',
                loanId: '',
                customerId: '',
                paymentDate: '',
                amountPaid: '',
                remainingBalance: ''
              });
            }}
          >
            Add Repayment
          </button>
          <button 
            className='bg-gray-500 text-white rounded-lg w-40 py-2 flex items-center justify-center' 
            onClick={() => setShowFilterPopup(true)}
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
                <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Repayment ID</th>
                <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Loan ID</th>
                <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Customer ID</th>
                <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Payment Date</th>
                <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Amount Paid</th>
                <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Remaining Balance</th>
                <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody>
              {repayments.map((repayment) => (
                <tr key={repayment.id} className="even:bg-gray-100">
                  <td className="py-2 px-4 border-b text-gray-600">{repayment.repaymentId}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{repayment.loanId}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{repayment.customerId}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{repayment.paymentDate}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{repayment.amountPaid}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{repayment.remainingBalance}</td>
                  <td className="py-2 px-4 border-b text-gray-600">
                    <button 
                      className="text-blue-500 hover:underline" 
                      onClick={() => handleEdit(repayment)}
                    >
                      Edit
                    </button> | 
                    <button 
                      className="text-red-500 hover:underline" 
                      onClick={() => handleDelete(repayment.id)}
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
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Repayment" : "Add New Repayment"}</h2>
            <form onSubmit={handleSubmit}>
              <input 
                type="number" 
                name="repaymentId" 
                placeholder="Repayment ID" 
                value={repaymentData.repaymentId} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
              />
              <input 
                type="number" 
                name="loanId" 
                placeholder="Loan ID" 
                value={repaymentData.loanId} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
              />
              <input 
                type="number" 
                name="customerId" 
                placeholder="Customer ID" 
                value={repaymentData.customerId} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
              />
              <input 
                type="date" 
                name="paymentDate" 
                placeholder="Payment Date" 
                value={repaymentData.paymentDate} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
              />
              <input 
                type="number" 
                name="amountPaid" 
                placeholder="Amount Paid" 
                value={repaymentData.amountPaid} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
              />
              <input 
                type="number" 
                name="remainingBalance" 
                placeholder="Remaining Balance" 
                value={repaymentData.remainingBalance} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
              />
              <button 
                type="submit" 
                className="bg-green-500 text-white rounded py-2 px-4"
              >
                {isEditing ? "Update" : "Add"}
              </button>
              <button 
                type="button" 
                className="bg-red-500 text-white rounded py-2 px-4 ml-2" 
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Filter Popup */}
      {showFilterPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Filter Repayments</h2>
            <form>
              <input 
                type="number" 
                name="loanId" 
                placeholder="Loan ID" 
                value={filter.loanId} 
                onChange={handleFilterChange} 
                className="border p-2 w-full mb-2" 
              />
              <input 
                type="number" 
                name="repaymentId" 
                placeholder="Repayment ID" 
                value={filter.repaymentId} 
                onChange={handleFilterChange} 
                className="border p-2 w-full mb-2" 
              />
              <input 
                type="date" 
                name="paymentDate" 
                placeholder="Payment Date" 
                value={filter.paymentDate} 
                onChange={handleFilterChange} 
                className="border p-2 w-full mb-2" 
              />
              <button 
                type="button" 
                className="bg-blue-500 text-white rounded py-2 px-4"
                onClick={() => {
                  fetchRepayments(); // Apply filter and fetch data
                  setShowFilterPopup(false);
                }}
              >
                Apply Filter
              </button>
              <button 
                type="button" 
                className="bg-gray-500 text-white rounded py-2 px-4 ml-2"
                onClick={() => setShowFilterPopup(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repayments;
