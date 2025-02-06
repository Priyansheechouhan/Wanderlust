const express = require("express");
const router = express.Router( {mergeParams: true} );
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const {isLoggedIn, validateReview, validateReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//post rout for reviews
router.post("/",isLoggedIn, validateReview , wrapAsync(reviewController.createReview));

//review delete rout
router.delete("/:reviewId",isLoggedIn, validateReviewAuthor, wrapAsync(reviewController.deleteReview))

module.exports = router;