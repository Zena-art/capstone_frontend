import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../utils/api'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem('token')
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  useEffect(() => {
    const fetchCartItemCount = async () => {
      if (token) {
        try {
          const response = await api.get('/cart/count')
          setCartItemCount(response.data.count)
        } catch (error) {
          console.error('Error fetching cart item count:', error)
          // Set cart count to 0 if there's an error
          setCartItemCount(0)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    fetchCartItemCount()
  }, [token, location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    setCartItemCount(0)
    navigate('/login')
  }

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/books', label: 'Books' },
    { path: '/open-library', label: 'Open Library' },
    ...(token ? [
      { 
        path: '/cart', 
        label: 'Cart', 
        badge: cartItemCount > 0 ? cartItemCount : null 
      },
      { path: '/orders', label: 'Orders' }
    ] : []),
    ...(isAdmin ? [{ path: '/admin', label: 'Admin' }] : [])
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            PageTurner
          </Link>
          <nav>
            <ul className="flex space-x-4 items-center">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`hover:text-blue-200 flex items-center ${
                      location.pathname === item.path ? 'font-bold' : ''
                    }`}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
              {token ? (
                <li>
                  <button onClick={handleLogout} className="hover:text-blue-200">
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="hover:text-blue-200">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="hover:text-blue-200">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          children
        )}
      </main>
      <footer className="bg-gray-200 p-4">
        <div className="container mx-auto text-center text-gray-600">
          © {new Date().getFullYear()} PageTurner. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Layout