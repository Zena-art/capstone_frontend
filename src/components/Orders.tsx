import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ShoppingBag, AlertCircle } from 'lucide-react'

interface OrderItem {
  _id: string
  title: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  items: OrderItem[]
  totalAmount: number
  status: string
  createdAt: string
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Fetch orders
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/orders', {
          headers: { 'x-auth-token': token }
        })
        // Update orders state
        setOrders(response.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('Failed to load orders. Please try again.')
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    // Display error message
    return (
      <div className="text-center mt-8 text-red-600 flex flex-col items-center">
        <AlertCircle className="w-12 h-12 mb-2" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl text-gray-600 mb-2">You haven't placed any orders yet.</p>
          <p className="text-gray-500">When you make a purchase, your orders will appear here.</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {orders.map(order => (
            <li key={order._id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Order #{order._id}</h2>
                <span className="text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <ul className="divide-y divide-gray-200">
                {order.items.map(item => (
                  <li key={item._id} className="py-2 flex justify-between">
                    <span className="font-medium">{item.title} <span className="text-gray-600">(x{item.quantity})</span></span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold text-lg">${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="mt-2 text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Orders