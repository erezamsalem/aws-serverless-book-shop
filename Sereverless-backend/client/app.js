document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const getBookForm = document.getElementById('getBookForm');
    const bookResult = document.getElementById('bookResult');

    // Function to add a new book
    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const bookData = {
            title: document.getElementById('title').value,
            author_firstname: document.getElementById('authorFirstname').value,
            author_middlename: document.getElementById('authorMiddlename') ? document.getElementById('authorMiddlename').value : '',
            author_lastname: document.getElementById('authorLastname').value,
            isbn: document.getElementById('isbn').value,
            format: document.getElementById('format').value,
            description: document.getElementById('description').value,
            price: parseFloat(document.getElementById('price').value), // Parse price as a float
            imageUrl: document.getElementById('imageUrl').value // Add the image URL
        };

        try {
            // URL replaced with example placeholder
            const response = await fetch('https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/api/books/createBook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookData)
            });

            const result = await response.json();
            alert('Book added successfully! ID: ' + result.response.id);
        } catch (error) {
            console.error('Error adding book:', error);
        }
    });

    // Function to get a book by ID
    getBookForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const bookId = document.getElementById('bookId').value;

        try {
            // URL replaced with example placeholder
            const response = await fetch(`https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/api/books/getBook?id=${bookId}`, {
                method: 'GET'
            });

            const result = await response.json();
            displayBook(result.book); // Update to result.book
        } catch (error) {
            console.error('Error fetching book:', error);
        }
    });

    // Function to display book details
    function displayBook(book) {
        const formattedPrice = `$${book.price.toFixed(2)} USD`;
        const authorName = (book.author && book.author.firstName && book.author.lastName) 
                            ? `${book.author.firstName} ${book.author.middleName ? book.author.middleName + ' ' : ''}${book.author.lastName}` 
                            : 'Author information not available';

        bookResult.innerHTML = `
            <h3>Book Details</h3>
            <p>Title: ${book.title}</p>
            <p>Author: ${authorName}</p>
            <p>ISBN: ${book.isbn}</p>
            <p>Format: ${book.format}</p>
            <p>Description: ${book.description}</p>
            <p>Price: ${formattedPrice}</p>
            <p><img src="${book.imageUrl}" alt="Book cover" style="max-width: 200px;"></p> `;
    }
});