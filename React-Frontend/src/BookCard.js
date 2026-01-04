// src/BookCard.js

// Unused 'useEffect' has been removed from the import statement.
import React, { useState } from 'react';
import './BookCard.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// IMPORTANT: Use the Stripe public key for your AWS application
const stripePromise = loadStripe('your_stripe_pk_test');

// The Checkout Form, now intended to be used inside a modal
const CheckoutForm = ({ clientSecret, book, onPaymentSuccess, customerId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    // THIS IS THE FIX: Added local state to manage and display form-specific errors.
    const [localErrorMessage, setLocalErrorMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        // Clear any previous errors when a new submission starts.
        setLocalErrorMessage(null);

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        email: 'erezamsalem@hotmail.com',
                    },
                },
            });

            if (error) {
                throw new Error(error.message);
            }

            if (paymentIntent.status === 'succeeded') {
                console.log('Payment succeeded for book:', book.title);

                const orderData = {
                    paymentIntentId: paymentIntent.id,
                    items: [{ bookId: book._id, quantity: 1 }],
                    currency: paymentIntent.currency,
                    paymentStatus: paymentIntent.status,
                    customerId: customerId
                };

                const response = await fetch('https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/api/orders/createOrder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                const result = await response.json();
                console.log('Order creation result:', result.message);

                onPaymentSuccess();
            } else {
                 throw new Error(`Payment failed with status: ${paymentIntent.status}`);
            }

        } catch (error) {
            console.error('Payment processing error:', error);
            // Set the local error message to be displayed in the form.
            setLocalErrorMessage(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="modal-title">Enter Payment Details</h3>
            <p className="modal-book-title">{book.title}</p>
            <div className="modal-card-element-container">
                <CardElement options={{ style: { base: { color: "#fff" } } }} />
            </div>
            <button type="submit" className="buy-button modal-submit-button" disabled={!stripe || isProcessing}>
                {isProcessing ? 'Processing...' : `Pay $${book.price}`}
            </button>
            {/* THIS IS THE FIX: Display the local error message state variable. */}
            {localErrorMessage && <div className="error modal-error">{localErrorMessage}</div>}
        </form>
    );
};

// The Main BookCard Component
const BookCard = ({ book }) => {
    const [clientSecret, setClientSecret] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [customerId, setCustomerId] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleBuyClick = async () => {
        setShowPaymentModal(true);
        try {
            const response = await fetch('https://6bssbxz4a7.execute-api.us-east-1.amazonaws.com/dev/api/payments/createPaymentIntent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Math.round(book.price * 100),
                    currency: 'usd',
                    email: 'erezamsalem@hotmail.com',
                    items: [{ bookId: book._id, quantity: 1 }]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setClientSecret(data.clientSecret);
            setCustomerId(data.customerId);
        } catch (error) {
            console.error('Error fetching client secret for book:', book.title, error);
            setErrorMessage('Failed to initialize payment. Please try again.');
        }
    };
    
    const closePaymentModal = () => {
        setShowPaymentModal(false);
        setClientSecret(''); // Reset client secret when modal closes
        setErrorMessage(null);
    };

    const handlePaymentSuccess = () => {
        closePaymentModal();
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
    };

    return (
        <>
            <div className="book-card">
                <img src={book.imageUrl} alt={book.title} />
                <div className="book-details">
                    <h2>{book.title}</h2>
                    {/* The new API nests author details in an 'author' object */}
                    <p>{book.author.firstName} {book.author.lastName}</p>
                    <p>{book.description}</p>
                    <p>${book.price}</p>
                    <button onClick={handleBuyClick} className="buy-button">
                        Buy it
                    </button>
                </div>
            </div>

            {showPaymentModal && (
                <div className="payment-modal-overlay">
                    <div className="payment-modal-content">
                        <button onClick={closePaymentModal} className="modal-close-button">&times;</button>
                        {clientSecret && customerId ? (
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <CheckoutForm 
                                    clientSecret={clientSecret} 
                                    customerId={customerId} 
                                    book={book} 
                                    onPaymentSuccess={handlePaymentSuccess}
                                    // The setErrorMessage prop is no longer needed here.
                                />
                            </Elements>
                        ) : (
                            <div className="modal-loading">{errorMessage || 'Loading Payment Form...'}</div>
                        )}
                    </div>
                </div>
            )}

            {showPopup && (
                <div className="popup">
                    <h2>Payment Successful</h2>
                    <p>Thank you for your purchase!</p>
                </div>
            )}
        </>
    );
};

export default BookCard;
