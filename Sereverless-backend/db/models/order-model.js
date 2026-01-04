const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    paymentIntentId: String,
    paymentMethodId: String,
    items: [{
        bookId: String,
        quantity: Number,
    }],
    totalAmount: Number,
    currency: String,
    paymentStatus: String,
    purchasedAt: { type: Date, default: Date.now },
    bookId: String,
    title: String,
    author: String,
    price: Number,
    imageUrl: String,
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
