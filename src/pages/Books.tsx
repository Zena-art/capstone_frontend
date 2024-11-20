import React from 'react'
import BookList from '../components/BookList'

const Books: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">All Books</h1>
      <BookList />
    </div>
  )
}

export default Books