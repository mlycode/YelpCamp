var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    seedDB          = require("./seeds"),
    User            = require("./models/user"),
    Comment         = require("./models/comment");
    
    
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    
//APP CONFIG
//seedDB();
//mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true }); //Local DB
mongoose.connect("mongodb://mlycode:password123@ds123852.mlab.com:23852/yelpcampmly", { useNewUrlParser: true }); //MLab hosted DB
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Camping is fun",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //.authenticate method comes from passport package in ./models/user.js
passport.serializeUser(User.serializeUser());//from package...
passport.deserializeUser(User.deserializeUser());//from package...

app.use(function(req, res, next){
    res.locals.currentUser = req.user; //provides currentUser var to every .ejs file
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//routes
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has started");
});