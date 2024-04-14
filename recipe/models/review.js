const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    text: { type: String, required: true }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;