if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpessError.js");
const session = require("express-session"); 
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");   
const User = require("./models/user.js");

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const users = require("./routes/users.js"); 
const dbUrl = process.env.ATLASDB_URL; 

app.use(express.json());
app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/register", async (req, res) => {
//     let email = "priyanshee@gmail.com";
//     let username = "priyanshee";
//     let password = "abcPriyanshee";

//     let registeredUser = await User.register(new User({username, email}), password);
//     res.send(registeredUser);
// })

app.use("/", users);

app.use("/listings", listings);

app.use("/listing/:id/reviews", reviews);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Sorry! page not found"));
});

app.use((err, req, res, next) => {
    let {statusCode, message} = err;
    console.log(err);
    res.render("error.ejs", {message});
})

app.listen(8080, () => {
    console.log("listening to the port");
})
