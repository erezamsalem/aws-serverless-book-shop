// Use process.env to keep your secret key secure and out of the code
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const handlerUtil = require('../libs/utils/handler-util');
const database = require('../db/db-manager');
const Book = require('../db/models/book-model'); // Ensure you have the Book model

module.exports = async (entry) => {
    const { amount, currency, email, items } = JSON.parse(entry.body);
    console.log('Request received:', { amount, currency, email, items });
    
    try {
        await database.connectToDatabase();
        console.log('Connected to database');

        const bookId = items[0].bookId;
        console.log('Fetching book details for bookId:', bookId);
        const book = await Book.findById(bookId);

        if (!book) {
            throw new Error('Book not found');
        }

        console.log('Book details fetched:', book);

        const customer = await stripe.customers.create({
            email: email
        });
        console.log('Customer created in Stripe:', customer);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            customer: customer.id,
            metadata: {
                title: book.title,
                author: `${book.author.firstName} ${book.author.lastName}`,
                description: book.description,
                isbn: book.isbn,
                format: book.format,
                price: book.price.toString()
            }
        });
        console.log('Payment Intent created in Stripe:', paymentIntent);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ clientSecret: paymentIntent.client_secret, customerId: customer.id })
        };
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};