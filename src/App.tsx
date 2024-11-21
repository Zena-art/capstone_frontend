import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import AdminDashboard from './components/AdminDashboard'
import BookList from './components/BookList'
import OpenLibrarySearch from './components/OpenLibrarySearch'
import Cart from './components/Cart'
import Orders from './components/Orders'

const ProtectedRoute: React.FC<{ element: React.ReactElement; adminOnly?: boolean }> = ({ element, adminOnly = false }) => {
  const isAuthenticated = !!localStorage.getItem('token')
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return element
}

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/open-library" element={<OpenLibrarySearch />} />
          <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
          <Route path="/orders" element={<ProtectedRoute element={<Orders />} />} />
          <Route 
            path="/admin" 
            element={<ProtectedRoute element={<AdminDashboard />} adminOnly={true} />} 
          />
          {/* Add other admin routes as needed */}
          <Route path="/admin/manage-books" element={<ProtectedRoute element={<div>Manage Books</div>} adminOnly={true} />} />
          <Route path="/admin/manage-users" element={<ProtectedRoute element={<div>Manage Users</div>} adminOnly={true} />} />
          <Route path="/admin/manage-orders" element={<ProtectedRoute element={<div>Manage Orders</div>} adminOnly={true} />} />
          <Route path="/admin/reports" element={<ProtectedRoute element={<div>Reports</div>} adminOnly={true} />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App