import React, { useState } from 'react'
import axios from 'axios'


// Define interfaces for type safety
interface OpenLibraryBook {
  key: string
  title: string
  author_name?: string[]
  cover_i?: number
  first_publish_year?: number
}

// OpenLibrarySearch component
const OpenLibrarySearch: React.FC = () => {
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState<OpenLibraryBook[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchBooks = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    // Perform search logic
    try {
      // Make a request to the Open Library API
      const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
      setBooks(response.data.docs)
    } catch (err) {
      setError('Failed to fetch books from Open Library. Please try again.')
      console.error('Error fetching books:', err)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Search Open Library</h2>
      <form onSubmit={searchBooks} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books..."
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book.key} className="border rounded p-4">
            {book.cover_i && (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={`Cover of ${book.title}`}
                className="w-full h-48 object-cover mb-2"
              />
            )}
            <h3 className="font-bold">{book.title}</h3>
            {book.author_name && <p>By {book.author_name.join(', ')}</p>}
            {book.first_publish_year && <p>First published: {book.first_publish_year}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OpenLibrarySearch