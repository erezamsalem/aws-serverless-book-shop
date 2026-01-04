// src/BookForm.js
import React, { useState } from 'react';

const BookForm = () => {
    const [book, setBook] = useState({
        title: '',
        authorFirstname: '',
        authorLastname: '',
        isbn: '',
        format: '',
        description: '',
        price: '',
        imageUrl: ''
    });

    const handleChange = (e) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/api/books/createBook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book)
            });
            const result = await response.json();
            alert(result.message || `Book added successfully! ID: ${result.id}`);
        } catch (error) {
            console.error('Error adding book:', error);
            alert('Error adding book. Check console for details.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Title:
                <input type="text" name="title" value={book.title} onChange={handleChange} required />
            </label>
            <label>
                Author First Name:
                <input type="text" name="authorFirstname" value={book.authorFirstname} onChange={handleChange} required />
            </label>
            <label>
                Author Last Name:
                <input type="text" name="authorLastname" value={book.authorLastname} onChange={handleChange} required />
            </label>
            <label>
                ISBN:
                <input type="text" name="isbn" value={book.isbn} onChange={handleChange} required />
            </label>
            <label>
                Format:
                <input type="text" name="format" value={book.format} onChange={handleChange} required />
            </label>
            <label>
                Description:
                <input type="text" name="description" value={book.description} onChange={handleChange} required />
            </label>
            <label>
                Price:
                <input type="number" step="0.01" name="price" value={book.price} onChange={handleChange} required />
            </label>
            <label>
                Image URL:
                <input type="text" name="imageUrl" value={book.imageUrl} onChange={handleChange} required />
            </label>
            <button type="submit">Add Book</button>
        </form>
    );
};

export default BookForm;
