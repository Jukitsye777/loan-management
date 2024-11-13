import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from './Firebase';

const Loans = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customerData, setCustomerData] = useState({
    repaymentId: '',
    loanId: '',
    customerId: '',
    paymentDate: '',
    amountPaid: '',
    remainingBalance: ''
  });
  const [customers, setCustomers] = useState([]);
  const [editCustomerId, setEditCustomerId] = useState(null);

  const [filter, setFilter] = useState({
    loanId: '',
    repaymentId: '',
    paymentDate: '',
  });

  // Handle input change for customer form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  // Handle form submission for adding or updating a customer
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing customer
        const customerRef = doc(db, "customers", editCustomerId);
        await updateDoc(customerRef, customerData);
        alert("Customer updated successfully!");
      } else {
        // Add new customer
        await addDoc(collection(db, "customers"), customerData);
        alert("Customer added successfully!");
      }
      setShowPopup(false); // Close the popup
      setCustomerData({
        repaymentId: '',
        loanId: '',
        customerId: '',
        paymentDate: '',
        amountPaid: '',
        remainingBalance: ''
      });
      fetchCustomers(); // Refresh the customers list after adding/updating
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save customer.");
    }
    setIsEditing(false); // Reset editing state
  };

  // Fetch and filter customers from Firestore
  const fetchCustomers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "customers"));
      let customersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Apply filtering based on the input values in the filter state
      customersList = customersList.filter((customer) => {
        return (
          (filter.loanId ? customer.loanId.includes(filter.loanId) : true) &&
          (filter.repaymentId ? customer.repaymentId.includes(filter.repaymentId) : true) &&
          (filter.paymentDate ? customer.paymentDate.includes(filter.paymentDate) : true)
        );
      });

      setCustomers(customersList);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  useEffect(() => {
    fetchCustomers(); // Load customers when the component mounts or filter changes
  }, [filter]); // Re-fetch when filter changes

  // Handle filter input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  // Open popup for editing a customer
  const handleEdit = (customer) => {
    setEditCustomerId(customer.id);
    setCustomerData({
      repaymentId: customer.repaymentId,
      loanId: customer.loanId,
      customerId: customer.customerId,
      paymentDate: customer.paymentDate,
      amountPaid: customer.amountPaid,
      remainingBalance: customer.remainingBalance
    });
    setIsEditing(true);
    setShowPopup(true);
  };

  // Delete a customer from Firestore and UI
  const handleDelete = async (customerId) => {
    try {
      // Delete customer from Firestore
      const customerRef = doc(db, "customers", customerId);
      await deleteDoc(customerRef);
      
      // Remove the customer from the UI (state)
      setCustomers(customers.filter(customer => customer.id !== customerId));
      
      alert("Customer deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete customer.");
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
              setCustomerData({
                repaymentId: '',
                loanId: '',
                customerId: '',
                paymentDate: '',
                amountPaid: '',
                remainingBalance: ''
              });
            }}
          >
            Add Customer
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
              {customers.map((customer) => (
                <tr key={customer.id} className="even:bg-gray-100">
                  <td className="py-2 px-4 border-b text-gray-600">{customer.repaymentId}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{customer.loanId}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{customer.customerId}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{customer.paymentDate}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{customer.amountPaid}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{customer.remainingBalance}</td>
                  <td className="py-2 px-4 border-b text-gray-600">
                    <button 
                      className="text-blue-500 hover:underline" 
                      onClick={() => handleEdit(customer)}
                    >
                      Edit
                    </button> | 
                    <button 
                      className="text-red-500 hover:underline" 
                      onClick={() => handleDelete(customer.id)}
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
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Customer" : "Add New Customer"}</h2>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="repaymentId" 
                placeholder="Repayment ID" 
                value={customerData.repaymentId} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
              />
              <input 
                type="text" 
                name="loanId" 
                placeholder="Loan ID" 
                value={customerData.loanId} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
              />
              <input 
                type="text" 
                name="customerId" 
                placeholder="Customer ID" 
                value={customerData.customerId} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
              />
              <input 
                type="date" 
                name="paymentDate" 
                value={customerData.paymentDate} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
              />
              <input 
                type="number" 
                name="amountPaid" 
                placeholder="Amount Paid" 
                value={customerData.amountPaid} 
                onChange={handleChange} 
                className="border p-2 w-full mb-2" 
              />
              <input 
                type="number" 
                name="remainingBalance" 
                placeholder="Remaining Balance" 
                value={customerData.remainingBalance} 
                onChange={handleChange} 
                className="border p-2 w-full mb-4" 
              />
              <div className="flex justify-end">
                <button type="submit" className="bg-brown text-white py-2 px-6 rounded">Save</button>
                <button 
                  type="button" 
                  className="ml-2 bg-gray-400 text-white py-2 px-6 rounded" 
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Popup */}
      {showFilterPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Filter</h2>
            <form>
              <input 
                type="text" 
                name="loanId" 
                placeholder="Filter by Loan ID" 
                value={filter.loanId} 
                onChange={handleFilterChange} 
                className="border p-2 w-full mb-2" 
              />
              <input 
                type="text" 
                name="repaymentId" 
                placeholder="Filter by Repayment ID" 
                value={filter.repaymentId} 
                onChange={handleFilterChange} 
                className="border p-2 w-full mb-2" 
              />
              <input 
                type="date" 
                name="paymentDate" 
                value={filter.paymentDate} 
                onChange={handleFilterChange} 
                className="border p-2 w-full mb-4" 
              />
              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="bg-brown text-white py-2 px-6 rounded" 
                  onClick={() => setShowFilterPopup(false)}
                >
                  Apply Filters
                </button>
                <button 
                  type="button" 
                  className="ml-2 bg-gray-400 text-white py-2 px-6 rounded" 
                  onClick={() => setShowFilterPopup(false)}
                >
                  Close
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
