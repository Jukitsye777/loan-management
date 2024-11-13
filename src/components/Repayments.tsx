import React from 'react'

const Repayments = () => {
  return (
    <div className='flex flex-col items-center w-full p-4'>
    <div className='flex flex-row justify-between w-full max-w-4xl'>
      <h1 className='text-brown text-2xl font-bold'>Repayments</h1>
      <button className='bg-brown text-white rounded-lg w-40 py-2 flex items-center justify-center'>Modify Repayments</button>
    </div>

    <div className="p-6">
    
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
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
        <tbody>
          <tr className="even:bg-gray-100">
            <td className="py-2 px-4 border-b text-gray-600">1</td>
            <td className="py-2 px-4 border-b text-gray-600">1</td>
            <td className="py-2 px-4 border-b text-gray-600">1</td>
            <td className="py-2 px-4 border-b text-gray-600">2023-02-01</td>
            <td className="py-2 px-4 border-b text-gray-600">$1000.00</td>
            <td className="py-2 px-4 border-b text-gray-600">$9000.00</td>
            <td className="py-2 px-4 border-b text-gray-600">
              <button className="text-blue-500 hover:underline">Edit</button> | 
              <button className="text-red-500 hover:underline">Delete</button>
            </td>
          </tr>
          <tr className="even:bg-gray-100">
            <td className="py-2 px-4 border-b text-gray-600">2</td>
            <td className="py-2 px-4 border-b text-gray-600">2</td>
            <td className="py-2 px-4 border-b text-gray-600">2</td>
            <td className="py-2 px-4 border-b text-gray-600">2023-03-15</td>
            <td className="py-2 px-4 border-b text-gray-600">$1500.00</td>
            <td className="py-2 px-4 border-b text-gray-600">$198500.00</td>
            <td className="py-2 px-4 border-b text-gray-600">
              <button className="text-blue-500 hover:underline">Edit</button> | 
              <button className="text-red-500 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  </div>
  )
}

export default Repayments
