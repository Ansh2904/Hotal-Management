const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const listing = require('../models/listing.js');
const { isLoggedIn } = require('../middleware.js');
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(','));
    } else {
        next();
    }
}

router.get('/', wrapAsync(async (req, res)=> {
  
    const allListings = await listing.find({});
    res.render('./listings/index.ejs', { listings: allListings });
    
    
}));

router.get('/:id/edit',isLoggedIn, wrapAsync(async (req, res)=> {
    const { id } = req.params;
    const findListing = await listing.findById(id);
    if (!findListing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    res.render('./listings/edit.ejs', { listing: findListing });
}));

router.put('/:id',isLoggedIn,validateListing, wrapAsync(async (req, res)=> {
    const { id } = req.params;
    const { title, description , image , price , location , country } = req.body;
   const updateListing =  await listing.findByIdAndUpdate(id, {
        title,
        description: description,
        images: image,
        price,
        location,
        country
    });
     console.log(updateListing);
     req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${id}`);
    // res.redirect('/listings');
}));

router.delete('/:id' ,isLoggedIn, wrapAsync(async (req,res)=> {
    const {id} = req.params;
    const deleteListing = await listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash('success', 'Successfully deleted the listing!');
    res.redirect('/listings');
}));


router.get('/new',isLoggedIn, (req, res)=> { 
    res.render('listings/new.ejs');
});

router.post('/' ,isLoggedIn,validateListing, wrapAsync(async (req, res)=> {
    const { title, description , image , price , location , country } = req.body;
    const newListing = new listing(req.body);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success', 'Successfully created a new listing!');
    res.redirect('/listings');
   
   
}));

router.get('/:id', wrapAsync(async (req , res)=> {
    const {id} = req.params;
    const findListing = await listing.findById(id).populate("reviews").populate('owner');
    if (!findListing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    res.render('./listings/show.ejs', { listing: findListing });
}));

module.exports = router;
