const mongoose = require('mongoose')

const Schema = mongoose.Schema


// items to be stored in the database: progress name, verses
const progressSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    verses: [{
        bookId: Number,
        chapter: Number,
        verse: Number,
        read: Boolean
    }]
})

module.exports = new mongoose.model("Progress", progressSchema)