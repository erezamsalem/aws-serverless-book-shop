const handlerUtil = require('../libs/utils/handler-util');
const database = require('../db/db-manager');
const Order = require('../db/models/order-model');
const Book = require('../db/models/book-model'); // Assuming you have a Book model

module.exports = async (entry) => {
    console.log('createOrder function called'); // Add logging
    const { paymentIntentId, items, currency, paymentStatus, paymentMethodId, customerId } = JSON.parse(entry.body);

    try {
        await database.connectToDatabase();
        console.log('Connected to database'); // Add logging

        // Check if an order with the same paymentIntentId already exists
        const existingOrder = await Order.findOne({ paymentIntentId });
        if (existingOrder) {
            console.log('Order already exists:', existingOrder); // Add logging
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*", // Include CORS header
                    "Access-Control-Allow-Credentials": true // Include CORS header
                },
                body: JSON.stringify({ message: 'Order already exists!' })
            };
        }

        // Assuming each order has a single item; adjust if needed
        const bookId = items[0].bookId;
        console.log('Fetching book details for bookId:', bookId); // Add logging
        const book = await Book.findById(bookId); // Fetch book details from the database

        // Ensure that the book details are fetched successfully
        if (!book) {
            throw new Error('Book not found');
        }

        console.log('Book details fetched:', book); // Add logging

        const newOrder = new Order({
            paymentIntentId: paymentIntentId,
            paymentMethodId: paymentMethodId,
            customerId: customerId, // Include customer ID
            items: items,
            currency: currency,
            paymentStatus: paymentStatus,
            purchasedAt: new Date(),
            bookId: book._id,
            title: book.title, // Fetch title from the book object
            author: book.author, // Fetch author from the book object
            description: book.description, // Fetch description from the book object
            isbn: book.isbn, // Fetch ISBN from the book object
            format: book.format, // Fetch format from the book object
            price: book.price, // Fetch price from the book object
            imageUrl: book.imageUrl, // Fetch imageUrl from the book object
            createdAt: new Date()
        });

        await newOrder.save();
        console.log('Order created:', newOrder); // Add logging

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Include CORS header
                "Access-Control-Allow-Credentials": true // Include CORS header
            },
            body: JSON.stringify({ message: 'Order created successfully!' })
        };
    } catch (error) {
        console.error('Error creating order:', error); // Add logging
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // Include CORS header
                "Access-Control-Allow-Credentials": true // Include CORS header
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};
