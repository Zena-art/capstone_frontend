import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Books from './pages/Books'
import OpenLibrarySearch from './components/OpenLibrarySearch'
import Login from './components/Login'
import Register from './components/Register'
import AdminDashboard from './components/AdminDashboard'

const ProtectedRoute: React.FC<{ element: React.ReactElement, allowedRole: string }> = ({ element, allowedRole }) => {
  const userRole = localStorage.getItem('userRole')
  return userRole === allowedRole ? element : <Navigate to="/login" replace />
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
            element={<ProtectedRoute element={<AdminDashboard />} allowedRole="admin" />} 
          />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App