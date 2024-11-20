import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Books from './pages/Books'
import OpenLibrarySearch from './components/OpenLibrarySearch'
import Login from './components/Login'
import Register from './components/Register'
import AdminDashboard from './components/AdminDashboard'
import Cart from './components/Cart'
import Orders from './components/Orders'

interface ProtectedRouteProps {
  element: React.ReactElement;
  allowedRole?: 'admin' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRole }) => {
  const token = localStorage.getItem('token')
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole === 'admin' && !isAdmin) {
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
          <Route path="/books" element={<Books />} />
          <Route path="/open-library" element={<OpenLibrarySearch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute 
                element={<AdminDashboard />} 
                allowedRole="admin" 
              />
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute 
                element={<Cart />} 
                allowedRole="user" 
              />
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute 
                element={<Orders />} 
                allowedRole="user" 
              />
            } 
          />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App