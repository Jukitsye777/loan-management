import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from './Firebase';

const Loans = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loanData, setLoanData] = useState({
    repaymentId: '',
    loanId: '',
    customerId: '',
    paymentDate: '',
    amountPaid: '',
    remainingBalance: '',
    interestRate: '',
    loanTerm: '',
    loanStatus: ''
  });
  const [loans, setLoans] = useState([]);
  const [editLoanId, setEditLoanId] = useState(null);

  const [filter, setFilter] = useState({
    loanId: '',
    repaymentId: '',
    paymentDate: '',
    loanStatus: ''
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
        const loanRef = doc(db, "loan", editLoanId);
        await updateDoc(loanRef, loanData);
        alert("Loan updated successfully!");
      } else {
        // Add new loan
        await addDoc(collection(db, "loan"), loanData);
        alert("Loan added successfully!");
      }
      setShowPopup(false); // Close the popup
      setLoanData({
        repaymentId: '',
        loanId: '',
        customerId: '',
        paymentDate: '',
        amountPaid: '',
        remainingBalance: '',
        interestRate: '',
        loanTerm: '',
        loanStatus: ''
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
      const querySnapshot = await getDocs(collection(db, "loan"));
      let loansList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Apply filtering based on the input values in the filter state
      loansList = loansList.filter((loan) => {
        return (
          (filter.loanId ? loan.loanId.includes(filter.loanId) : true) &&
          (filter.repaymentId ? loan.repaymentId.includes(filter.repaymentId) : true) &&
          (filter.paymentDate ? loan.paymentDate.includes(filter.paymentDate) : true) &&
          (filter.loanStatus ? loan.loanStatus.includes(filter.loanStatus) : true)
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
      repaymentId: loan.repaymentId,
      loanId: loan.loanId,
      customerId: loan.customerId,
      paymentDate: loan.paymentDate,
      amountPaid: loan.amountPaid,
      remainingBalance: loan.remainingBalance,
      interestRate: loan.interestRate,
      loanTerm: loan.loanTerm,
      loanStatus: loan.loanStatus
    });
    setIsEditing(true);
    setShowPopup(true);
  };

  // Delete a loan from Firestore and UI
  const handleDelete = async (loanId) => {
    try {
      const loanRef = doc(db, "loan", loanId);
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
        <h1 className='text-brown text-2xl font-bold'>Loans</h1>
        <div className='flex space-x-2'>
          <button 
            className='bg-brown text-white rounded-lg w-40 py-2 flex items-center justify-center' 
            onClick={() => {
              setShowPopup(true);
              setIsEditing(false);
              setLoanData({
                repaymentId: '',
                loanId: '',
                customerId: '',
                paymentDate: '',
                amountPaid: '',
                remainingBalance: '',
                interestRate: '',
                loanTerm: '',
                loanStatus: ''
              });
            }}
          >
            Add Loan
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
                <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Interest Rate</th>
                <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Loan Term</th>
                <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Loan Status</th>
                <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className="even:bg-gray-100">
                  <td className="py-2 px-4 border-b text-gray-600">{loan.repaymentId}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{loan.loanId}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{loan.customerId}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{loan.paymentDate}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{loan.amountPaid}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{loan.remainingBalance}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{loan.interestRate}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{loan.loanTerm}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{loan.loanStatus}</td>
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

      {/* Popup for adding/editing loan */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Loan" : "Add Loan"}</h2>
            <form onSubmit={handleSubmit}>
              <input 
                type="number" 
                name="repaymentId" 
                placeholder="Repayment ID" 
                value={loanData.repaymentId} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
                required 
              />
              <input 
                type="number" 
                name="loanId" 
                placeholder="Loan ID" 
                value={loanData.loanId} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
                required 
              />
              <input 
                type="number" 
                name="customerId" 
                placeholder="Customer ID" 
                value={loanData.customerId} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
                required 
              />
              <input 
                type="date" 
                name="paymentDate" 
                placeholder="Payment Date" 
                value={loanData.paymentDate} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
                required 
              />
              <input 
                type="number" 
                name="amountPaid" 
                placeholder="Amount Paid" 
                value={loanData.amountPaid} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
                required 
              />
              <input 
                type="number" 
                name="remainingBalance" 
                placeholder="Remaining Balance" 
                value={loanData.remainingBalance} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
                required 
              />
              <input 
                type="number" 
                name="interestRate" 
                placeholder="Interest Rate (%)" 
                value={loanData.interestRate} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
                required 
              />
              <input 
                type="number" 
                name="loanTerm" 
                placeholder="Loan Term (Months/Years)" 
                value={loanData.loanTerm} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
                required 
              />
              <select 
                name="loanStatus" 
                value={loanData.loanStatus} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
                required
              >
                <option value="">Select Loan Status</option>
                <option value="Active">Active</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
              <button 
                type="submit" 
                className="bg-blue-500 text-white py-2 px-4 rounded w-full mt-4"
              >
                {isEditing ? "Update Loan" : "Add Loan"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Popup for filter */}
      {showFilterPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Filter Loans</h2>
            <form>
              <input 
                type="text" 
                name="loanId" 
                placeholder="Loan ID" 
                value={filter.loanId} 
                onChange={handleFilterChange} 
                className="border p-2 w-full mb-2" 
              />
              <input 
                type="text" 
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
              <input 
                type="text" 
                name="loanStatus" 
                placeholder="Loan Status" 
                value={filter.loanStatus} 
                onChange={handleFilterChange} 
                className="border p-2 w-full mb-2" 
              />
              <div className="flex justify-between mt-4">
                <button 
                  type="button" 
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                  onClick={() => setShowFilterPopup(false)}
                >
                  Apply Filter
                </button>
                <button 
                  type="button" 
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                  onClick={() => {
                    setFilter({ loanId: '', repaymentId: '', paymentDate: '', loanStatus: '' });
                    fetchLoans(); // Reset and fetch all loans
                    setShowFilterPopup(false);
                  }}
                >
                  Clear Filter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
