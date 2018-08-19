var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX ROUTE - show all campgrounds
router.get("/", function(req, res){
    //Get campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
});
//CREATE ROUTE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
   // get data from form to add to campgrounds DB
   var name = req.body.siteName;
   var image = req.body.siteImage;
   var desc = req.body.siteDescription;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var price = req.body.sitePrice;
   var newCampground = {name: name, image: image, description: desc, author: author, price: price};
   // Create new campground to save to DB
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
            //redirect to campgrounds page
            res.redirect("/campgrounds");
       }
   });

});
//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new");
});
//SHOW ROUTE - show info for one ID - MUST come after new
router.get("/:id", function(req, res) {
    //find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            req.flash("error", "This campground does not exist");
            console.log(err);
        } else {
            //render show template with that campground
             res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE - get form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
            req.flash("error", err.message);
            res.redirect("back");
       } else {
           res.render("campgrounds/edit", {campground: foundCampground});
       }
    });
});
    
//UPDATE CAMPGROUND ROUTE - put
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
   //find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.site, function(err, updatedCampground){
       if(err){
           req.flash("error", "Something went wrong");
           res.redirect("/campgrounds");
       } else {
           req.flash("success", "Campground successfully updated");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

//DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           req.flash("error", "Something went wrong");
           res.redirect("/campgrounds");
       } else {
           req.flash("success", "Campground successfully deleted");
           res.redirect("/campgrounds");
       }
   });
});



module.exports = router;