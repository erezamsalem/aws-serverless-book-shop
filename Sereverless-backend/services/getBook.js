const handlerUtil = require('../libs/utils/handler-util');
const database = require('../db/db-manager');
const BookModel = require('../db/models/book-model');

module.exports = (entry) => {
    return new Promise((resolve) => {
        let bookSearchDetails;

        if (entry.queryStringParameters.id) {
            bookSearchDetails = { _id: entry.queryStringParameters.id };
        } else if (entry.queryStringParameters.isbn) {
            bookSearchDetails = { isbn: entry.queryStringParameters.isbn };
        } else {
            resolve(
                handlerUtil.formatHandlerResponse(400, {
                    error: 'Unable to retrieve book without ISBN or ID provided.'
                })
            );
        }

        database
            .connectToDatabase()
            .then(async () => {
                await BookModel.findOne(bookSearchDetails)
                    .then((book) => {
                        if (!book) {
                            resolve(
                                handlerUtil.formatHandlerResponse(404, {
                                    error: 'Book not found.'
                                })
                            );
                        } else {
                            resolve(
                                handlerUtil.formatHandlerResponse(200, {
                                    book: book
                                })
                            );
                        }
                    })
                    .catch((error) => {
                        console.error(
                            error,
                            'An error occurred when attempting to retrieve the book record.'
                        );
                        resolve(
                            handlerUtil.formatHandlerResponse(500, {
                                error: 'Unable to retrieve book. ' + JSON.stringify(error)
                            })
                        );
                    });
            })
            .catch((error) => {
                console.error(
                    error,
                    'An error occurred when connecting to the database.'
                );
                resolve(
                    handlerUtil.formatHandlerResponse(500, { error: error })
                );
            });
    });
};
