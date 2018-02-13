var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    expressSanitizer = require("express-sanitizer")
    app = express(),
    methodOverride = require("method-override"),
    path = require("path")
    passport = require("passport"),
    LocalStrategy = require("passport-local")
    seedDB = require("./seed");


//seedDB(); // Start seed
mongoose.connect("mongodb://localhost/nest_ticket");
app.set("view engine","ejs")
app.set('views', path.join(__dirname, 'views'));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer()); // Removing all script attacks from input
app.use(methodOverride("_method"));


/**
 *      MODELS
 */

var Tickets         = require("./models/ticket"),
    TicketComments  = require("./models/ticketComment"),
    Users = require("./models/user");


/** Passport settings  */

app.use(require("express-session")({
    secret : "au!0`-YC~C9m=g`faXIi/bv`%~Cj#gX_f5i[-j o(|Yhfi!]|[|w<K{BDEa*$sT+')",
    resave : false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
  })

/**
 *      Routes
 */

 var ticketRoutes = require("./routes/ticket"),
    ticketCommentRoutes = require("./routes/ticketComment"),
    authenticationRoute = require("./routes/index");

    app.use("/ticket", ticketRoutes);
    app.use("/ticket", ticketCommentRoutes);
    app.use("/", authenticationRoute);

app.get("/", function(req,res){
    res.redirect("/ticket");
});

/** TEMP */
app.get("/r/:subredditName", function(req,res){
    var subreddit = req.params.subredditName;
    res.send(subreddit);
});



app.get("*", function(req,res){
    /* Always triggers if is first */
    res.send("404");
});
app.listen(3000, 'localhost',function(){
    console.log("Server has started!!");
});
