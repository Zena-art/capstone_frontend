import React, { useState, useEffect } from 'react'
import { ShoppingCart, AlertCircle, Plus, Minus } from 'lucide-react'
import api from '../utils/api'

interface Book {
  _id: string
  title: string
  author: string
  isbn: string
  price: number
  stockQuantity: number
  description?: string
  coverImage?: string
}

interface CartItem extends Book {
  quantity: number
}

interface PaginatedResponse {
  books: Book[]
  currentPage: number
  totalPages: number
  totalBooks: number
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchBooks()
  }, [currentPage])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await api.get<PaginatedResponse>(`/books?page=${currentPage}&limit=10`)
      setBooks(response.data.books)
      setCurrentPage(response.data.currentPage)
      setTotalPages(response.data.totalPages)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching books:', err)
      setError('Failed to fetch books. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (book: Book) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === book._id)
      if (existingItem) {
        return prevCart.map(item =>
          item._id === book._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prevCart, { ...book, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (bookId: string) => {
    setCart(prevCart => prevCart.filter(item => item._id !== bookId))
  }

  const updateCartItemQuantity = (bookId: string, newQuantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item._id === bookId 
          ? { ...item, quantity: Math.max(0, newQuantity) } 
          : item
      ).filter(item => item.quantity > 0)
    )
  }

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Book Store</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <AlertCircle className="inline-block mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : books.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">No books available.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{book.title}</h2>
                  <p className="text-gray-600">{book.author}</p>
                  <p className="text-2xl font-bold mt-2">${book.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                  <p className="text-sm text-gray-500">Stock: {book.stockQuantity}</p>
                </div>
                <div className="p-4 bg-gray-50">
                  <button
                    onClick={() => addToCart(book)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="mx-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="mx-2 py-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="mx-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        {cart.length === 0 ? (
          <p className="text-lg text-gray-500">Your cart is empty.</p>
        ) : (
          <div>
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item._id} className="py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500">by {item.author}</p>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateCartItemQuantity(item._id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-200"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-200"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="ml-4 p-1 text-red-600 hover:text-red-800"
                      aria-label="Remove item"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <p className="text-xl font-bold">Total: ${cartTotal.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookList