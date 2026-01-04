const handlerUtil = require('../libs/utils/handler-util');
const database = require('../db/db-manager');
const Order = require('../db/models/order-model');

module.exports = async (event) => {
    try {
        await database.connectToDatabase();
        const orders = await Order.find().sort({ createdAt: -1 });

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(orders)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};
