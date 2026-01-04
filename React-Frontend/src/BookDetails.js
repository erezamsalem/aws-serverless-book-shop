// src/BookDetails.js
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useElements, useStripe, CardElement } from '@stripe/react-stripe-js';



const stripePromise = loadStripe('pk_test_here');

const BookDetails = () => {
    const [bookId, setBookId] = useState('');
    const [book, setBook] = useState(null);
    const [clientSecret, setClientSecret] = useState('');

    const handleFetchBook = async () => {
        try {
            const response = await fetch(`https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/api/books/getBook?id=${bookId}`);
            const bookData = await response.json();
            setBook(bookData);
            const { clientSecret } = await createPaymentIntent(bookData);
            setClientSecret(clientSecret);
        } catch (error) {
            console.error('Error fetching book:', error);
        }
    };

    const createPaymentIntent = async (book) => {
        const response = await fetch('https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/api/payments/createPaymentIntent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: Math.round(book.price * 100),
                currency: 'usd',
                items: [{ bookId: book.id, quantity: 1 }]
            })
        });

        const paymentIntent = await response.json();
        return paymentIntent;
    };

    return (
        <div>
            <input type="text" value={bookId} onChange={(e) => setBookId(e.target.value)} placeholder="Enter Book ID" />
            <button onClick={handleFetchBook}>Get Book</button>
            {book && (
                <div>
                    <h3>{book.title}</h3>
                    <p>Author: {book.authorFirstName} {book.authorLastName}</p>
                    <p>ISBN: {book.isbn}</p>
                    <p>Format: {book.format}</p>
                    <p>Description: {book.description}</p>
                    <p>Price: ${book.price}</p>
                    <img src={book.imageUrl} alt={book.title} style={{ maxWidth: '200px' }} />
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentForm clientSecret={clientSecret} book={book} />
                    </Elements>
                </div>
            )}
        </div>
    );
};

const PaymentForm = ({ clientSecret, book }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    email: 'youremail@youremail.com'
                }
            }
        });

        if (error) {
            console.error(error.message);
        } else {
            console.log('PaymentIntent:', paymentIntent);

            const orderData = {
                paymentIntentId: paymentIntent.id,
                items: [{ bookId: book.id, quantity: 1 }],
                totalAmount: paymentIntent.amount,
                currency: paymentIntent.currency,
                paymentStatus: paymentIntent.status,
            };

            try {
                const response = await fetch('https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/api/orders/createOrder', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });

                const result = await response.json();
                console.log(result.message);

                alert('Payment successful and order created!');
            } catch (error) {
                console.error('Error creating order:', error);
            }
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit">Buy it</button>
        </form>
    );
};

export default BookDetails;
