import React from 'react'
import { Link } from 'react-router-dom'
import { Book } from '../types'

interface BookListProps {
  books: Book[]
}

const BookList: React.FC<BookListProps> = ({ books }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {books.map(({ _id, title, author, price, coverImage }) => (
      <div key={_id} className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={coverImage || `/placeholder.svg?height=200&width=150`}
          alt={`Cover of ${title}`}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 mb-2">{author}</p>
          <p className="text-blue-600 font-bold">${price.toFixed(2)}</p>
          <Link
            to={`/books/${_id}`}
            className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    ))}
  </div>
)

export default BookList