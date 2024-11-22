import React, { useState, useEffect } from 'react'
import { Plus, Minus, Trash2 } from 'lucide-react'

// Define the structure of a cart item
interface CartItem {
  _id: string
  title: string
  author: string
  price: number
  quantity: number
}

const Cart: React.FC = () => {
  // State to hold the items in the cart
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Effect to load cart items from localStorage and set up event listener
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    }

    loadCart()
    // Listen for changes to localStorage from other tabs/windows
    window.addEventListener('storage', loadCart)

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('storage', loadCart)
    }
  }, [])

  // Function to update cart in state and localStorage
  const updateCart = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    // Dispatch custom event to notify other components of cart update
    window.dispatchEvent(new Event('cartUpdated'))
  }

  // Function to update the quantity of an item in the cart
  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    const updatedCart = cartItems.map(item =>
      item._id === itemId ? { ...item, quantity: Math.max(0, newQuantity) } : item
    ).filter(item => item.quantity > 0)

    updateCart(updatedCart)
  }

  // Function to remove an item from the cart
  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item._id !== itemId)
    updateCart(updatedCart)
  }

  // Calculate the total price of all items in the cart
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  // Render empty cart message if there are no items
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <p className="text-lg text-gray-500">Your cart is empty.</p>
      </div>
    )
  }

  // Render cart with items
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <li key={item._id} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500">by {item.author}</p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => updateCartItemQuantity(item._id, item.quantity - 1)}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="ml-4 p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 flex justify-end">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-xl font-bold">Total: ${cartTotal.toFixed(2)}</p>
          <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart