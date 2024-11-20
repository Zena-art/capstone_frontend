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
        const { data } = await axios.get<Book[]>('http://localhost:3000/api/books')
        setBooks(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching books:', err)
        setError('Failed to load books. Please try again later.')
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  if (loading) return <div className="text-center mt-8">Loading books...</div>
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to PageTurner</h1>
      <BookList books={books} />
    </div>
  )
}

export default Home