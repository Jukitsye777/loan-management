import React, { useState } from 'react';
import Customer from './Customer';
import Loans from './Loans';
import Repayments from './Repayments';
import LoanStatus from './LoanStatus';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Customers');

  return (
    <div className="bg-beige h-screen w-full flex flex-col items-center">
      <h1 className="text-brown text-2xl font-bold my-4">Loan Management System</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        {['Customers', 'Loans', 'Repayments', 'Loan Status'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab ? 'bg-brown text-white' : 'bg-beige text-brown border border-brown'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Based on Active Tab */}
      <div className="w-full flex justify-center">
        {activeTab === 'Customers' && <Customer />}
        {activeTab === 'Loans' && <Loans/>}
        {activeTab === 'Repayments' && <Repayments/>}
        {activeTab === 'Loan Status' && <LoanStatus/>}
      </div>
    </div>
  );
};

export default Dashboard;
