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

interface ProtectedRouteProps {
  element: React.ReactElement
  adminOnly?: boolean
}
// Define the ProtectedRoute component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, adminOnly = false }) => {
  const isAuthenticated = !!localStorage.getItem('token')
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
// Check if the user is authenticated and if they have admin privileges
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
// If adminOnly is true and the user is not an admin, redirect to the home page
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return element
}

export default function App() {
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}