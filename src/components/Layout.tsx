import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Book, LogOut, Library, Settings } from 'lucide-react'
import api from '../utils/api'

// Define the Layout component as a functional component
export default function Layout({ children }: { children: React.ReactNode }) {
  // Initialize state variables to track cart item count and admin status
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

  // Use the useEffect hook to update cart item count and admin status
  useEffect(() => {
    // Function to update cart item count
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const count = cart.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0)
      setCartItemCount(count)
    }

    // Function to check admin status
    const checkAdminStatus = () => {
      const adminStatus = localStorage.getItem('isAdmin')
      setIsAdmin(adminStatus === 'true')
    }

    // Call updateCartCount and checkAdminStatus on component mount
    updateCartCount()
    checkAdminStatus()

    // Add event listeners for storage and custom cartUpdated event
    window.addEventListener('storage', updateCartCount)
    window.addEventListener('cartUpdated', updateCartCount)

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Clear local storage and reset state
      localStorage.removeItem('token')
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('cart')
      setCartItemCount(0)
      setIsAdmin(false)
      // Redirect to login page
      navigate('/login')
    }
  }

  return (
    // Define the structure of the layout
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo and site title */}
          <Link to="/" className="text-2xl font-bold flex items-center">
            <Book className="mr-2" />
            PageTurner
          </Link>
          {/* Navigation links */}
          <div className="flex items-center space-x-4">
            <Link to="/books" className="hover:text-blue-200 transition-colors duration-200">
              Books
            </Link>
            <Link to="/open-library" className="hover:text-blue-200 transition-colors duration-200 flex items-center">
              <Library className="mr-1" />
              <span>Open Library</span>
            </Link>
            <Link to="/cart" className="hover:text-blue-200 transition-colors duration-200 flex items-center">
              <ShoppingCart className="mr-1" />
              <span>Cart ({cartItemCount})</span>
            </Link>
            {/* Conditional rendering of Admin link */}
            {isAdmin && (
              <Link to="/admin" className="hover:text-blue-200 transition-colors duration-200 flex items-center">
                <Settings className="mr-1" />
                <span>Admin</span>
              </Link>
            )}
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="hover:text-blue-200 transition-colors duration-200 flex items-center"
            >
              <LogOut className="mr-1" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </header>
      {/* Main content area */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      {/* Footer */}
      <footer className="bg-gray-100 text-center py-4 mt-8">
        <p>&copy; {new Date().getFullYear()} PageTurner. All rights reserved.</p>
      </footer>
    </div>
  )
}