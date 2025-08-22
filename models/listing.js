const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    images: {
        type: String,
        set: (v) => v === ' ' ? 'http://oimfashion.com/wp-content/uploads/2018/02/exterior-shot-min.jpg': v,
        default: "http://oimfashion.com/wp-content/uploads/2018/02/exterior-shot-min.jpg",


    },
    price: Number,   
    location: String,
    country : String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

listingSchema.post('findOneAndDelete', async (listing)=>{
    if(listing){
    await Review.deleteMany({ _id : { $in: listing.reviews } });
    }
});

const listing = mongoose.model('listing', listingSchema);
module.exports = listing;
