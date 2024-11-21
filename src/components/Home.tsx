import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const adminStatus = localStorage.getItem('isAdmin')
    setIsLoggedIn(!!token)
    setIsAdmin(adminStatus === 'true')
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Welcome to PageTurner</h1>
      <p className="text-xl text-center mb-8">Your one-stop shop for all your reading needs!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Browse Our Collection</h2>
          <p className="mb-4">Discover a wide range of books from various genres. From bestsellers to hidden gems, we have something for every reader.</p>
          <Link to="/books" className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors">
            Explore Books
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Search Open Library</h2>
          <p className="mb-4">Access millions of books from the Open Library. Find rare editions, academic texts, and more.</p>
          <Link to="/open-library" className="inline-block bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors">
            Search Open Library
          </Link>
        </div>
      </div>
      
      {!isLoggedIn && !isAdmin && (
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Get Started Today</h2>
          <p className="mb-4">Join our community of book lovers. Create an account to start your reading journey with PageTurner.</p>
          <Link to="/register" className="inline-block bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition-colors mr-4">
            Register
          </Link>
          <Link to="/login" className="inline-block bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors">
            Login
          </Link>
        </div>
      )}
    </div>
  )
}

export default Home