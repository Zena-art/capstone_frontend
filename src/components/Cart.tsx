import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

interface CartItem {
  _id: string
  title: string
  price: number
  quantity: number
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/cart', {
          headers: { 'x-auth-token': token }
        })
        setCartItems(response.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching cart:', err)
        setError('Failed to load cart. Please try again.')
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/cart/${itemId}`, { quantity: newQuantity }, {
        headers: { 'x-auth-token': token }
      })
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      )
    } catch (err) {
      console.error('Error updating quantity:', err)
      setError('Failed to update quantity. Please try again.')
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/cart/${itemId}`, {
        headers: { 'x-auth-token': token }
      })
      setCartItems(prevItems => prevItems.filter(item => item._id !== itemId))
    } catch (err) {
      console.error('Error removing item:', err)
      setError('Failed to remove item. Please try again.')
    }
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (loading) return <div className="text-center mt-8">Loading cart...</div>
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {cartItems.map(item => (
              <li key={item._id} className="py-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <p className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</p>
            <Link
              to="/checkout"
              className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart