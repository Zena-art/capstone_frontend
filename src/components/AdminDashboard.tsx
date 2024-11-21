import React, { useState, useEffect } from 'react'
import { PlusCircle, Pencil, Trash2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../utils/api'

// ... (previous imports and interfaces)

const AdminDashboard: React.FC = () => {
  // ... (previous state declarations)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10)
      }
      if (selectedBook) {
        await api.put(`/books/${selectedBook._id}`, bookData)
      } else {
        await api.post('/books', bookData)
      }
      fetchBooks(currentPage)
      resetForm()
      setError('')
    } catch (err: any) {
      console.error('Error saving book:', err)
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Failed to save book: ${err.response.data.message || 'Unknown error'}`)
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response received from server. Please try again.')
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  // ... (rest of the component code)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Manage Books</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <AlertCircle className="inline-block mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* ... (rest of the JSX) */}
    </div>
  )
}

export default AdminDashboard