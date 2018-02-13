/** 
========= TICKET ROUTE =========
Name    Path                HTTP    Desc

    Route /ticket/
    */

    var express = require("express");
    var router = express.Router();

var Users         = require("../models/user");

const util = require('util')

// HTTP GET ROUTE /register/
router.get("/register", function(req,res){
    res.render("index/register");
});

router.post("/register", function(req, res){
    req.body.user.body = req.sanitize(req.body.user.body);
    Users.register(new Users({ username: req.body.user.username}),req.body.user.password, function(err, user){
        if(err){ console.log(err); }
        else{ 
            console.log("Register");
            passport.authenticate("local")(req,res, function (){
                res.redirect("/ticket");
            });
        }
    });
    console.log(req.body);
});

// HTTP GET ROUTE /login/
router.get("/login", function(req,res){
    res.render("index/login");
});

router.post('/login', passport.authenticate('local', { successRedirect: '/',
failureRedirect: '/login' }));

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;