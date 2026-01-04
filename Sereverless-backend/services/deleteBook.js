const handlerUtil = require('../libs/utils/handler-util');
const database = require('../db/db-manager');
const BookModel = require('../db/models/book-model');

module.exports = (entry) => {
    return new Promise((resolve) => {
        let bookQuery;

        if (entry.queryStringParameters.id) {
            bookQuery = { _id: entry.queryStringParameters.id };
        } else {
            resolve(
                handlerUtil.formatHandlerResponse(404, {
                    error: 'Unable to delete the book record, id is required.'
                })
            );
        }

        database
            .connectToDatabase()
            .then(async () => {
                BookModel.findOneAndDelete(bookQuery)
                    .then((response) => {
                        resolve(
                            handlerUtil.formatHandlerResponse(200, {
                                response: {
                                    message: 'Successfully deleted book',
                                    results: {
                                        record_deleted: true,
                                        id: response._id
                                    }
                                }
                            })
                        );
                    })
                    .catch((error) => {
                        console.error(
                            error,
                            'An error occurred when attempting to delete the book record.'
                        );
                        resolve(
                            handlerUtil.formatHandlerResponse(500, {
                                error:
                                    'Unable to delete the book record. ' + error
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
