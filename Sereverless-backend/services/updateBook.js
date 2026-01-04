const handlerUtil = require('../libs/utils/handler-util');
const database = require('../db/db-manager');
const BookModel = require('../db/models/book-model');

module.exports = (entry) => {
    return new Promise((resolve) => {
        let bookDetails = JSON.parse(entry.body);

        database
            .connectToDatabase()
            .then(async () => {
                let newBookDetails = {};
                if (bookDetails.title) newBookDetails.title = bookDetails.title;
                if (bookDetails.subtitle)
                    newBookDetails.subtitle = bookDetails.subtitle;
                if (bookDetails.author_firstname)
                    newBookDetails.author_firstname =
                        bookDetails.author_firstname;
                if (bookDetails.author_lastname)
                    newBookDetails.author_lastname =
                        bookDetails.author_lastname;
                if (bookDetails.description)
                    newBookDetails.description = bookDetails.description;
                if (bookDetails.format)
                    newBookDetails.format = bookDetails.format;
                if (bookDetails.price) newBookDetails.price = bookDetails.price;
                if (bookDetails.imageUrl) newBookDetails.imageUrl = bookDetails.imageUrl; // Add the image URL

                let updateQuery = { $set: newBookDetails };

                let bookQuery = { _id: bookDetails.id };

                let options = { upsert: true };

                BookModel.findOneAndUpdate(bookQuery, updateQuery, options)
                    .then((response) => {
                        if (response.isbn) {
                            resolve(
                                handlerUtil.formatHandlerResponse(200, {
                                    response: {
                                        message: 'Successfully updated book',
                                        results: {
                                            record_updated: true,
                                            id: response._id
                                        }
                                    }
                                })
                            );
                        } else {
                            resolve(
                                handlerUtil.formatHandlerResponse(200, {
                                    response: {
                                        message: 'Book record not modified',
                                        results: response
                                    }
                                })
                            );
                        }
                    })
                    .catch((error) => {
                        console.error(
                            error,
                            'An error occurred when attempting to update the book record.'
                        );
                        resolve(
                            handlerUtil.formatHandlerResponse(500, {
                                error:
                                    'Unable to update the book record. ' + error
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
                    handlerUtil.formatHandlerResponse(500, {
                        error: 'Error connecting to database. ' + error
                    })
                );
            });
    });
};
