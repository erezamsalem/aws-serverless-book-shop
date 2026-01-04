const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let DB_URL = process.env.DB_URL;

// The following assumes use of MongoDB Shared Cluster
exports.connectToDatabase = async () => {
    return mongoose
        .connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('Connection to DB successful'))
        .catch((err) => console.error(err, 'Error'));
};
