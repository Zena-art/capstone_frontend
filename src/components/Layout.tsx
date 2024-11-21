import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Book, LogOut, Library, Settings } from 'lucide-react'
import api from '../utils/api'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const count = cart.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0)
      setCartItemCount(count)
    }

    const checkAdminStatus = () => {
      const adminStatus = localStorage.getItem('isAdmin')
      setIsAdmin(adminStatus === 'true')
    }

    updateCartCount()
    checkAdminStatus()

    window.addEventListener('storage', updateCartCount)
    window.addEventListener('cartUpdated', updateCartCount)

    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('cart')
      setCartItemCount(0)
      setIsAdmin(false)
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <Book className="mr-2" />
            PageTurner
          </Link>
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
            {isAdmin && (
              <Link to="/admin" className="hover:text-blue-200 transition-colors duration-200 flex items-center">
                <Settings className="mr-1" />
                <span>Admin</span>
              </Link>
            )}
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
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-100 text-center py-4 mt-8">
        <p>&copy; 2023 PageTurner. All rights reserved.</p>
      </footer>
    </div>
  )
}