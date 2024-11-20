import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Book } from '../types'

interface BookListProps {
  books?: Book[]
}

const BookList: React.FC<BookListProps> = ({ books: propBooks }) => {
  const [books, setBooks] = useState<Book[]>(propBooks || [])
  const [loading, setLoading] = useState(!propBooks)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!propBooks) {
      const fetchBooks = async () => {
        try {
          const response = await axios.get<{ books: Book[] }>('http://localhost:3000/api/books')
          if (Array.isArray(response.data.books)) {
            setBooks(response.data.books)
          } else {
            throw new Error('Received data does not contain a books array')
          }
        } catch (err) {
          console.error('Error fetching books:', err)
          setError('Failed to load books. Please try again later.')
        } finally {
          setLoading(false)
        }
      }

      fetchBooks()
    }
  }, [propBooks])

  if (loading) {
    return <div className="text-center mt-8">Loading books...</div>
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>
  }

  if (books.length === 0) {
    return <div className="text-center mt-8">No books available.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={book.coverImage || `/placeholder.svg?height=200&width=150`}
            alt={`Cover of ${book.title}`}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
            <p className="text-gray-600 mb-2">{book.author}</p>
            <p className="text-blue-600 font-bold">${book.price.toFixed(2)}</p>
            <Link
              to={`/books/${book._id}`}
              className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BookList