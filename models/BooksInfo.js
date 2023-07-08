// Require mongoose module
const mongoose = require("mongoose");

// Declaring an instance of monfoose.Schema
const Schema = mongoose.Schema;

// Defining BookInfoSchema
const BookInfoSchema = new Schema ({
    bookName: {
        type: String,
        required: true,
    },
    bookCategory: {
        type: String,
        required: true,
    },
    bookDescription: {
        type: String,
        required: true,
    },
    UploaderName: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
    },
    path: {
        type: String,
    }
}, { timestamps: true })

// initializing it in a model
const BooksInfo = mongoose.model('BooksInfo', BookInfoSchema);
// Exporting    BooksInfo
module.exports =  BooksInfo;