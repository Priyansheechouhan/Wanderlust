const express = require('express'); 
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

router.route("/")
    //index rout : showing all lists of properties
    .get(wrapAsync(listingController.index))
    //new post rout: to create new listing
    .post(isLoggedIn,
    upload.single("listing[image][url]"), 
    validateListing,
    wrapAsync (listingController.createListing));
    // .post(, (req, res) => {
    //     res.send(req.file);
    // });

//new rout: to display form to create new listing document
router.get("/new", isLoggedIn, listingController.createListingForm);

router.route("/:id")
    //show rout: showing perticular property detail
    .get(wrapAsync(listingController.showListing))
    //update rout: to update details of listing
    .put(isOwner, 
        isLoggedIn,
        upload.single("listing[image][url]"), 
        validateListing, wrapAsync (listingController.updateListing))
    //delete route to delete listing
    .delete(isOwner, isLoggedIn, wrapAsync(listingController.deleteListing));

//edit rout: get rout form to edit listing
router.get("/:id/edit",isOwner, isLoggedIn, wrapAsync(listingController.editListingFrom));

module.exports = router;