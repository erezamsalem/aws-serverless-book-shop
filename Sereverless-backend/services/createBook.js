const handlerUtil = require('../libs/utils/handler-util');
const database = require('../db/db-manager');
const BookModel = require('../db/models/book-model');

module.exports = (entry) => {
    return new Promise((resolve) => {
        let bookDetails = JSON.parse(entry.body);

        database
            .connectToDatabase()
            .then(async () => {
                let newBook = new BookModel({
                    title: bookDetails.title,
                    author: {
                        firstName: bookDetails.author_firstname,
                        lastName: bookDetails.author_lastname
                    },
                    description: bookDetails.description,
                    isbn: bookDetails.isbn,
                    format: bookDetails.format,
                    price: bookDetails.price,
                    imageUrl: bookDetails.imageUrl // Add the image URL
                });

                await newBook
                    .save()
                    .then((savedBook) => {
                        let response = {
                            message: 'New book entry created!',
                            record_created: true,
                            id: savedBook._id
                        };

                        resolve(
                            handlerUtil.formatHandlerResponse(201, {
                                response: response
                            })
                        );
                    })
                    .catch((error) => {
                        console.error(
                            error,
                            'An error occurred when attempting to create the book record.'
                        );
                        resolve(
                            handlerUtil.formatHandlerResponse(500, {
                                error: 'Unable to save book. ' + JSON.stringify(error)
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
