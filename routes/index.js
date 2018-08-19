var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

//ROUTES

router.get("/", function(req, res){
    res.render("landing");
});


//==================
//AUTHENTICATION ROUTES
//==================

//show register form
router.get("/register", function(req, res){
    res.render("register");
});
//sign up logic - post route
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, req, function(){ //from passport package
            req.flash("success", "Sign Up Successful, Welcome " + user.username + "!");
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});
//login logic - post - middleware from passport package passport.authenticate
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    successFlash: "Welcome back",
    failureFlash: "Username and/or password were incorrect"
    }), function(req, res){
});

//logut route
router.get("/logout", function(req, res) {
    req.logout(); //from packages
    req.flash("success", "Logged out");
    res.redirect("/campgrounds");
});


module.exports = router;