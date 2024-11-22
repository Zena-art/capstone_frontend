# PageTurner

PageTurner is a full-stack web application for an online bookstore, providing users with a platform to browse, search, and purchase books. It also integrates with the Open Library API for an extended catalog.

![PageTurner Screenshot]()

## Features

- User authentication (login, register, logout)
- Browse and search books from our collection
- Integration with Open Library for extended book search
- Shopping cart functionality
- Admin dashboard for managing books and orders
- Responsive design for mobile and desktop

## Technologies Used

### Frontend
- React.js
- TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB for database
- Mongoose as ODM
- JSON Web Tokens (JWT) for authentication

## Project Structure
pageturner/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── utils/
│       ├── App.tsx
│       └── index.tsx
├── backend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
└── README.md


## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/zena-art/pageturner.git
   cd pageturner
   \`\`\`

2. Install backend dependencies:
   \`\`\`
   cd backend
   npm install
   \`\`\`

3. Install frontend dependencies:
   \`\`\`
   cd ../frontend
   npm install
   \`\`\`

4. Create a \`.env\` file in the backend directory with the following content:
   \`\`\`
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   \`\`\`

5. Start the backend server:
   \`\`\`
   cd ../backend
   npm start
   \`\`\`

6. In a new terminal, start the frontend development server:
   \`\`\`
   cd ../frontend
   npm start
   \`\`\`

7. Open your browser and navigate to \`http://localhost:3000\` to view the application.

## API Endpoints

- \`POST /api/auth/register\`: Register a new user
- \`POST /api/auth/login\`: Login user
- \`POST /api/auth/logout\`: Logout user
- \`GET /api/books\`: Get all books
- \`POST /api/books\`: Add a new book (admin only)
- \`PUT /api/books/:id\`: Update a book (admin only)
- \`DELETE /api/books/:id\`: Delete a book (admin only)
- \`GET /api/cart\`: Get user's cart
- \`POST /api/cart\`: Add item to cart
- \`PUT /api/cart/:id\`: Update cart item
- \`DELETE /api/cart/:id\`: Remove item from cart

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

## Deployment

This project is automatically deployed to Netlify on every push to the main branch.

- Deployed URL: https://your-site-name.netlify.app
- Last deployment status: [View in Netlify Dashboard](https://zena-nazim-pageturner.netlify.app/)

To view the latest deployment, simply visit the Deployed URL above.

- [Open Library API](https://openlibrary.org/developers/api) for providing access to their extensive book catalog.
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework.
- [Lucide](https://lucide.dev/) for the beautiful icon set.