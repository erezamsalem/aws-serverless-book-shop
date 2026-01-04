const handlerUtil = require('../libs/utils/handler-util');
const database = require('../db/db-manager');
const BookModel = require('../db/models/book-model');

module.exports = () => {
    return new Promise((resolve) => {
        database
            .connectToDatabase()
            .then(async () => {
                await BookModel.find({})
                    .then((books) => {
                        resolve(
                            handlerUtil.formatHandlerResponse(200, {
                                books: books
                            })
                        );
                    })
                    .catch((error) => {
                        console.error(
                            error,
                            'An error occurred when attempting to retrieve all books.'
                        );
                        resolve(
                            handlerUtil.formatHandlerResponse(500, {
                                error: 'Unable to retrieve books. ' + JSON.stringify(error)
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
