// Handler
'use strict';

// Imports
const booksApi = require('./services/books-api');

// Books API
module.exports.createBook = async (event) => {
    return booksApi.createBook(event);
};

module.exports.getBook = async (event) => {
    return booksApi.getBook(event);
};

module.exports.updateBook = async (event) => {
    return booksApi.updateBook(event);
};

module.exports.deleteBook = async (event) => {
    return booksApi.deleteBook(event);
};

module.exports.getAllBooks = async (event) => {
    return booksApi.getAllBooks(event);
};

module.exports.createPaymentIntent = async (event) => {
    return booksApi.createPaymentIntent(event);
};

module.exports.createOrder = async (event) => {
    return booksApi.createOrder(event);
};

module.exports.getAllOrders = async (event) => {  // Add this line
    return booksApi.getAllOrders(event);
};
