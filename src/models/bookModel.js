//Sandip
const mongoose = require('mongoose')
var moment = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    excerpt: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    ISBN: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: [{
        type: String,
        required: true
    }],
    reviews: {
        type: Number,
        default: 0
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    releasedAt: {
        type: String,
        required: true  // format("YYYY-MM-DD")
    },

}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);