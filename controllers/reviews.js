const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let {id} = req.params;
    let {review} = req.body;
    let listing = await Listing.findById(id);

    let newReview = new Review(review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("review added")
    req.flash("success", "Review addeed successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reveiws: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully");   
    res.redirect(`/listings/${id}`);
    
}