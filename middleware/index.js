var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error", "Campground was not found");
                res.redirect("back");
            } else {
                //does the user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You do not have permission to edit this content");
                    res.redirect("back");
                }
            }
        });
        }  else {
            res.redirect("back");
        }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){ //is a user logged in?
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment was not found");
                res.redirect("back");
            } else {
                //does the user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You do not have permission to edit this content");
                    res.redirect("back");
                }
            }
        });
        }  else {
            req.flash("error", "You do not have permission to edit this content");
            res.redirect("back");
        }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;