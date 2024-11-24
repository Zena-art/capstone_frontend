import React, { useState, useEffect } from 'react'
import { PlusCircle, Pencil, Trash2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'

// Define the structure of a book object
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

// Define the structure of the paginated response
interface PaginatedResponse {
  books: Book[]
  currentPage: number
  totalPages: number
  totalBooks: number
}

export default function AdminDashboard() {
  // State variables
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isAddingBook, setIsAddingBook] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    price: '',
    stockQuantity: ''
  })
  const navigate = useNavigate()

  // Fetch books when the component mounts or when the current page changes
  useEffect(() => {
    fetchBooks(currentPage)
  }, [currentPage])

  // Function to fetch books from the API
  const fetchBooks = async (page: number) => {
    try {
      setLoading(true)
      const response = await api.get<PaginatedResponse>(`/books?page=${page}&limit=10`)
      setBooks(response.data.books)
      setCurrentPage(response.data.currentPage)
      setTotalPages(response.data.totalPages)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching books:', err)
      if (err.response && err.response.status === 401) {
        navigate('/login')
      } else {
        setError('Failed to fetch books. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle form submission (add or edit book)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10)
      }
      if (editingBook) {
        await api.put(`/books/${editingBook._id}`, bookData)
      } else {
        await api.post('/books', bookData)
      }
      fetchBooks(currentPage)
      resetForm()
      setError(null)
    } catch (err: any) {
      console.error('Error saving book:', err)
      if (err.response && err.response.status === 401) {
        navigate('/login')
      } else if (err.response) {
        setError(`Failed to save book: ${err.response.data.message || 'Unknown error'}`)
      } else if (err.request) {
        setError('No response received from server. Please try again.')
      } else {
        setError(`Error: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle book deletion
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        setLoading(true)
        await api.delete(`/books/${id}`)
        fetchBooks(currentPage)
        setError(null)
      } catch (err: any) {
        console.error('Error deleting book:', err)
        if (err.response && err.response.status === 401) {
          navigate('/login')
        } else {
          setError('Failed to delete book. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }
  }

  // Reset form and editing state
  const resetForm = () => {
    setFormData({ title: '', author: '', isbn: '', price: '', stockQuantity: '' })
    setIsAddingBook(false)
    setEditingBook(null)
  }

  // Start editing a book
  const startEditing = (book: Book) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      price: book.price.toString(),
      stockQuantity: book.stockQuantity.toString()
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Manage Books</h1>
      
      {/* Error message display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <AlertCircle className="inline-block mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Add new book button */}
      {!isAddingBook && !editingBook && (
        <button
          onClick={() => setIsAddingBook(true)}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center"
        >
          <PlusCircle className="mr-2" /> Add New Book
        </button>
      )}

      {/* Add/Edit book form */}
      {(isAddingBook || editingBook) && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Saving...' : editingBook ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      )}

      {/* Loading spinner or book list */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">No books available. Add a new book to get started.</p>
        </div>
      ) : (
        <>
          {/* Book list table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{book.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{book.isbn}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${book.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{book.stockQuantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => startEditing(book)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        <Pencil className="inline-block" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="inline-block" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <ChevronLeft className="inline-block" /> Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Next <ChevronRight className="inline-block" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}