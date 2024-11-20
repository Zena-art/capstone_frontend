import React, { useState, useEffect } from 'react'
import axios from 'axios'
import BookList from '../components/BookList'
import { Book } from '../types'

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get<Book[]>('http://localhost:3000/api/books')
        console.log('API response:', response.data)
        if (Array.isArray(response.data)) {
          setBooks(response.data)
        } else {
          throw new Error('Received data is not an array')
        }
      } catch (err) {
        console.error('Error fetching books:', err)
        setError('Failed to load books. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  if (loading) {
    return <div className="text-center mt-8">Loading books...</div>
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to PageTurner</h1>
      <BookList books={books} />
    </div>
  )
}

export default Home