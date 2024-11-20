import React from 'react'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to PageTurner</h1>
      <p className="text-xl mb-8 text-gray-600">Your one-stop shop for all your reading needs.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/books" 
          className="bg-blue-500 text-white p-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
        >
          <h2 className="text-2xl font-semibold mb-2">Browse Books</h2>
          <p className="text-blue-100">Explore our extensive collection of books</p>
        </Link>
        <Link 
          to="/open-library" 
          className="bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
        >
          <h2 className="text-2xl font-semibold mb-2">Open Library Search</h2>
          <p className="text-green-100">Search for books in the Open Library database</p>
        </Link>
      </div>
    </div>
  )
}

export default Home