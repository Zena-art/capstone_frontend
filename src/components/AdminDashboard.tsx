import React from 'react'
import { Link } from 'react-router-dom'

const AdminDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/admin/manage-books" 
          className="bg-blue-500 text-white p-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Books</h2>
          <p className="text-blue-100">Add, edit, or remove books from the inventory</p>
        </Link>
        <Link 
          to="/admin/manage-users" 
          className="bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
          <p className="text-green-100">View and manage user accounts</p>
        </Link>
        <Link 
          to="/admin/manage-orders" 
          className="bg-purple-500 text-white p-6 rounded-lg shadow-md hover:bg-purple-600 transition duration-200"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Orders</h2>
          <p className="text-purple-100">View and process customer orders</p>
        </Link>
        <Link 
          to="/admin/reports" 
          className="bg-yellow-500 text-white p-6 rounded-lg shadow-md hover:bg-yellow-600 transition duration-200"
        >
          <h2 className="text-xl font-semibold mb-2">View Reports</h2>
          <p className="text-yellow-100">Access sales and inventory reports</p>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard