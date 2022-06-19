const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

exports.connect = () => {
    mongoose.connect(MONGO_URI)
    .then(() => {console.log("Successfully connected to database")})
    .catch((error) => {
        console.log("database connection failed");
        console.log(error);
    })
}