const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
}

module.exports.signup = async(req, res) => {
    try{
        let {email, username, password} = req.body;
        let newUser = new User({email, username});
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            
            res.redirect("/listings");
        })
        
    } catch(er) {
        req.flash("error", er.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
}

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err) {
            req.flash("error", "Something went wrong");
            return next(err);
        }
        req.flash("success", "Goodbye");
        res.redirect("/listings");
    });
    
}