const Listing = require("../models/listing.js");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxgeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListing = await Listing.find();
    res.render("listings/index.ejs", {allListing});
};

module.exports.createListingForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listDetail = await Listing.findById(id).populate({ path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listDetail) {
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listDetail}); 
};

module.exports.createListing = async (req, res, next) => {
    //let {title, description, image, price, location, country} = req.body;
    // let location = req.body.listing.location;
    // let country = req.body.listing.country;
    // let response = await geocodingClient.forwardGeocode({
    //     query: location + ", " + country,
    //     limit: 1
    //   })
    // .send();
    
    // console.log("happening something");
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename};
    //newlisting.geometry = response.body.features[0].geometry;
    console.log(newlisting);
    await newlisting.save();
    req.flash("success", "Successfully created new listing");   
    res.redirect("/listings");
};

module.exports.editListingFrom = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    // let location = req.body.listing.location;
    // let country = req.body.listing.country;
    // let response = await geocodingClient.forwardGeocode({
    //     query: location + ", " + country,
    //     limit: 1
    //   })
    // .send();
   // listing.geometry = response.body.features[0].geometry;
    await listing.save();
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing updated successfully");   
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully");   
    res.redirect("/listings");
};