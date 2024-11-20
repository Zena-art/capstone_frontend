import React, { useState, useEffect } from 'react'
import axios from 'axios'

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
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/orders', {
          headers: { 'x-auth-token': token }
        })
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

  if (loading) return <div className="text-center mt-8">Loading orders...</div>
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
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
                    <span>{item.title} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="mt-2 text-right">
                <span className={`inline-block px-2 py-1 rounded ${
                  order.status === 'Completed' ? 'bg-green-200 text-green-800' :
                  order.status === 'Processing' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-gray-200 text-gray-800'
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