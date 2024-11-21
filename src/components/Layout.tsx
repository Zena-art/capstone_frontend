import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0)

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartItemCount(cart.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0))
    }

    updateCartCount()
    window.addEventListener('storage', updateCartCount)

    return () => {
      window.removeEventListener('storage', updateCartCount)
    }
  }, [])

  return (
    <div>
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">PageTurner</Link>
          <div className="flex items-center">
            <Link to="/cart" className="flex items-center">
              <ShoppingCart className="mr-2" />
              <span>Cart ({cartItemCount})</span>
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto mt-4">
        {children}
      </main>
    </div>
  )
}

export default Layout