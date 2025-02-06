const mongoose = require("mongoose");
const Review = require("./reviews.js");

const listingSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String
    },
    image: {
        url: {    
            type: String,
            default : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlsbGF8ZW58MHx8MHx8fDA%3D",
            // set: (url) => {
            //     url === "" ? "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlsbGF8ZW58MHx8MHx8fDA%3D" : url;
            // },
        },
        filename: {
            type: String,
            default: "listingimage",
        },
        
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    // geometry: {
    //     type: {
    //         type: String,
    //         enum: ["Point"],
    //         required: true
    //     }, 
    //     coordinates: {
    //         type: [Number],
    //         required: true
    //     }
    // }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({
            _id: {$in: listing.reviews}
        });
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;