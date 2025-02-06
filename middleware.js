const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpessError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        console.log(req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in first");
        return res.redirect("/login");
    } else {
        next();
    }
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.validateListing = (req, res, next) => {
    let result = req.body;
    console.log(result);
    let {error} = listingSchema.validate(req.body);
    if(error) {
        throw new ExpressError(400, error)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    console.log(req.body);
    if(error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
    
}

module.exports.validateReviewAuthor = async (req, res, next) => {
    let {reviewId, id} = req.params;
    let review = await Review.findById(reviewId);
    let listing = await Listing.findById(id);
    if(!review.author._id.equals(req.user._id) && !listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You are not allowed to delete this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
    
}