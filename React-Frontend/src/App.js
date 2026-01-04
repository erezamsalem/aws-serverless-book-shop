// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from './BookCard';
import './App.css';

const App = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // The API endpoint for your new AWS backend
    axios.get('https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/api/books/getAllBooks')
      .then(response => {
        // The new API nests the books array inside a 'books' property
        if (response.data && response.data.books) {
            setBooks(response.data.books);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the books!', error);
      });
  }, []);

  return (
    <div className="app">
      <h1>Book Catalog</h1>
      <div className="book-list">
        {/* The new API uses '_id' as the unique identifier for the key */}
        {books.map(book => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
      {/* The footer is now included */}
      <footer className="app-footer">
        <a
          href="https://erez-amsalem-web-developer.azurewebsites.net/"
          target="_blank"
          rel="noopener noreferrer"
        >
          © Erez Amsalem
        </a>
      </footer>
    </div>
  );
};

export default App;
