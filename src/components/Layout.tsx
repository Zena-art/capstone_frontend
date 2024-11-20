import React from 'react'
import { Link } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          PageTurner
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/books" className="hover:underline">Books</Link></li>
          </ul>
        </nav>
      </div>
    </header>
    <main className="flex-grow container mx-auto p-4">
      {children}
    </main>
    <footer className="bg-gray-200 p-4">
      <div className="container mx-auto text-center">
        © {new Date().getFullYear()} PageTurner. All rights reserved.
      </div>
    </footer>
  </div>
)

export default Layout