import React, { useState, useEffect } from 'react';
  import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
  import { db } from './Firebase';

  const Customer = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [customerData, setCustomerData] = useState({
      repaymentId: '',
      loanId: '',
      customerId: 0,
      name: '',
      address: '',
      contactInfo: 0,
      accountNumber: '',
      paymentDate: '',
      amountPaid: '',
      remainingBalance: ''
    });
    const [customers, setCustomers] = useState([]);
    const [editCustomerId, setEditCustomerId] = useState(null);



//the loan part
const [loanData, setLoanData] = useState({

  loanId: '',
  customerId: '',
  
});
const [loans, setLoans] = useState([]);
const [editLoanId, setEditLoanId] = useState(null);







const [repaymentData, setRepaymentData] = useState({
 
  loanId: '',
  customerId: '',
 
});
const [repayments, setRepayments] = useState([]);
const [editRepaymentId, setEditRepaymentId] = useState(null);




const [loanData2, setLoanData2] = useState({
  loanId: '',
 // Add overdueDays to loan data
});
const [loans2, setLoans2] = useState([]);
const [editLoanId2, setEditLoanId2] = useState(null);


//til here










    const [filter, setFilter] = useState({
      loanId: '',
      repaymentId: '',
      paymentDate: '',
    });

    // Handle input change for customer form
    const handleChange = (e) => {
      const { name, value } = e.target;
      setCustomerData({ ...customerData, [name]: value });
      setLoanData({ ...loanData, [name]: value });
      setRepaymentData({ ...repaymentData, [name]: value });
      setLoanData2({ ...loanData2, [name]: value });
    };

    // Handle form submission for adding or updating a customer
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (isEditing) {
          const customerRef = doc(db, "customer", editCustomerId);
          const loanRef = doc(db, "loan", editLoanId);
          const repaymentRef = doc(db, "repayments", editRepaymentId);
          const loanRef2 = doc(db, "loanstatus", editLoanId2);
   
          await updateDoc(customerRef, customerData);
          await updateDoc(loanRef, loanData);
          await updateDoc(repaymentRef, repaymentData);
          await updateDoc(loanRef2, loanData2);
          alert("Customer updated successfully!");
        } else {
          await addDoc(collection(db, "customer"), customerData);
          await addDoc(collection(db, "loan"), loanData);
          await addDoc(collection(db, "repayments"), repaymentData);
          await addDoc(collection(db, "loanstatus"), loanData2);
          alert("Customer added successfully!");
        }
        setShowPopup(false);
        setCustomerData({
          repaymentId: '',
          loanId: '',
          customerId: 0,
          name: '',
          address: '',
          contactInfo: 0,
          accountNumber: '',
          paymentDate: '',
          amountPaid: '',
          remainingBalance: ''
        });

        setLoanData({
         
          loanId: '',
          customerId: '',
       
        });



        setRepaymentData({
         
          loanId: '',
          customerId: '',
         
        });


        setLoanData2({
          loanId: '',
     

        });



        fetchCustomers();
      } catch (error) {
        console.error("Error saving document: ", error);
        alert("Failed to save customer.");
      }
      setIsEditing(false);
    };

    // Fetch and filter customers from customer collection in Firestore
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "customer"));
        let customersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

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
      fetchCustomers();
    }, [filter]);

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
        name: customer.name,
        address: customer.address,
        contactInfo: customer.contactInfo,
        accountNumber: customer.accountNumber,
        paymentDate: customer.paymentDate,
        amountPaid: customer.amountPaid,
        remainingBalance: customer.remainingBalance
      });
      setIsEditing(true);
      setShowPopup(true);
    };

    // Delete a customer from customer collection in Firestore and UI
    const handleDelete = async (customerId) => {
      try {
        const customerRef = doc(db, "customer", customerId);
        await deleteDoc(customerRef);
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
          <h1 className='text-brown text-2xl font-bold'>Customers</h1>
          <div className='flex space-x-2'>
            <button 
              className='bg-brown text-white rounded-lg w-40 py-2' 
              onClick={() => {
                setShowPopup(true);
                setIsEditing(false);
                setCustomerData({
                  repaymentId: '',
                  loanId: '',
                  customerId: 0,
                  name: '',
                  address: '',
                  contactInfo: 0,
                  accountNumber: '',
                  paymentDate: '',
                  amountPaid: '',
                  remainingBalance: ''
                });
              }}
            >
              Add Customer
            </button>
            <button 
              className='bg-gray-500 text-white rounded-lg w-40 py-2' 
              onClick={() => setShowFilterPopup(true)}
            >
              Filter
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Customer ID</th>
                  <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Name</th>
                  <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Address</th>
                  <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Contact Info</th>
                  <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Account Number</th>
                  <th className="py-2 px-4 border-b text-left text-gray-700 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="even:bg-gray-100">
                    <td className="py-2 px-4 border-b text-gray-600">{customer.customerId}</td>
                    <td className="py-2 px-4 border-b text-gray-600">{customer.name}</td>
                    <td className="py-2 px-4 border-b text-gray-600">{customer.address}</td>
                    <td className="py-2 px-4 border-b text-gray-600">{customer.contactInfo}</td>
                    <td className="py-2 px-4 border-b text-gray-600">{customer.accountNumber}</td>
                    <td className="py-2 px-4 border-b text-gray-600">
                      <button className="text-blue-500 hover:underline" onClick={() => handleEdit(customer)}>Edit</button> | 
                      <button className="text-red-500 hover:underline" onClick={() => handleDelete(customer.id)}>Delete</button>
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
                  type="number" 
                  name="customerId" 
                  placeholder="Customer ID" 
                  value={customerData.customerId} 
                  onChange={handleChange} 
                  className="border p-2 w-full mb-2" 
                />
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Name" 
                  value={customerData.name} 
                  onChange={handleChange} 
                  className="border p-2 w-full mb-2" 
                />
                <input 
                  type="text" 
                  name="address" 
                  placeholder="Address" 
                  value={customerData.address} 
                  onChange={handleChange} 
                  className="border p-2 w-full mb-2" 
                />
                <input 
                  type="number" 
                  name="contactInfo" 
                  placeholder="Contact Info" 
                  value={customerData.contactInfo} 
                  onChange={handleChange} 
                  className="border p-2 w-full mb-2" 
                />
                <input 
                  type="number" 
                  name="accountNumber" 
                  placeholder="Account Number" 
                  value={customerData.accountNumber} 
                  onChange={handleChange} 
                  className="border p-2 w-full mb-2" 
                />
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => setShowPopup(false)} 
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    {isEditing ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Popup form for filter */}
        {showFilterPopup && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-xl font-bold mb-4">Filter Customers</h2>
              <form>
                <input 
                  type="number" 
                  name="loanId" 
                  placeholder="Loan ID" 
                  value={filter.customerId} 
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
                  value={filter.paymentDate} 
                  onChange={handleFilterChange} 
                  className="border p-2 w-full mb-2" 
                />
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => setShowFilterPopup(false)} 
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      fetchCustomers();
                      setShowFilterPopup(false);
                    }} 
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Apply Filter
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default Customer;