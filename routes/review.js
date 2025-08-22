const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review.js');
const { reviewSchema } = require('../schema.js');
const listing = require('../models/listing.js');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(','));
    } else {
        next();
    }
}

router.post('/' ,validateReview, wrapAsync(async (req, res)=> {
    let list = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    req.flash('success', 'Successfully added a review!');
    res.redirect(`/listings/${list._id}`);
}));

router.delete('/:reviewId', wrapAsync(async (req, res)=> {
    const { id, reviewId } = req.params;
    const findListing = await listing.findByIdAndUpdate(id , { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!');
    res.redirect(`/listings/${id}`);
}));

module.exports = router;