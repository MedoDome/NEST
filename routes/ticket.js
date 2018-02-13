/** 
========= TICKET ROUTE =========
Name    Path                HTTP    Desc

Index   /ticket             GET     List all tickets
New     /ticket/new         GET     Show post form
Create  /ticket/            POST    Create new ticket
Show    /ticket/:id         GET     Show ticket
Edit    /ticket/:id/edit    GET     Show edit form
Update  /ticket/:id         PUT     Update ticket
Destroy /ticket/:id         DELETE  Delete ticket


Route /ticket/
*/

var express = require("express");
var router = express.Router();

var Tickets         = require("../models/ticket");

// HTTP GET ROUTE /ticket/
router.get("/", isLoggedIn, function(req,res){
    Tickets.find({'author' : req.user._id}, function(err, tickets){
        if(err){
            res.send("404");
            console.log("Error: " + err);
        }
        else{
            res.render("ticket/list",{tickets: tickets});
        }
    });
   
    // console.log(req);
    // console.log(res);
});

// HTTP GET ROUTE /ticket/new

router.get("/new", isLoggedIn, function(req,res){
    res.render("ticket/new");
});

router.post("/",isLoggedIn, function(req, res){
    req.body.ticket.body = req.sanitize(req.body.ticket.body);

    req.body.ticket.author = req.user._id;

    Tickets.create(req.body.ticket, function(err, newTicket){
        if(err){
            res.render("ticket/new");
        }
        else{
            res.redirect("ticket/")
        }
    });
});

router.get("/:id", function(req,res){
    Tickets.findById(req.params.id).populate({
        path: "comments",
        populate : {
            path : "author",
            model : "User"
        }
    }).populate("author").exec(function(err, foundTicket){
        if(err){ res.redirect("/"); }
        else { 
            console.log("Author: " + foundTicket.author._id);
            if(req.user)
                console.log("UserLogged: " + req.user._id);

            res.render("ticket/view", {ticket: foundTicket});
        }
    });
});

/** Ticket edit routes */

router.get("/:id/edit",isLoggedIn, function(req,res){
    Tickets.findById(req.params.id, function(err, foundTicket){
        if(err){ res.redirect("/"); }
        else { res.render("ticket/edit", {ticket: foundTicket});}
    });
});

router.put("/:id",isLoggedIn, function(req,res){
    Tickets.findByIdAndUpdate(req.params.id,req.body.ticket, function(err, updatedTicket){
        if(err){
            res.redirect("/ticket/");
        }
        else{
            res.redirect("/ticket/" + req.params.id)
        }
    });
});

/**  Ticket delete routes */

router.delete("/:id",isLoggedIn, function(req,res){
    Tickets.findByIdAndRemove(req.params.id, function(err, foundTicket){
        /** Fix redirect @TODO */
        if(err){ res.redirect("ticket/"); }
        else { res.redirect("ticket/");}
    });
});

router.post("/:id/set",isLoggedIn, function(req,res){
    Tickets.findById(req.params.id, function(err, foundTicket){
        if(err){ console.log("SET ERROR : " + err) }
        else { 
            foundTicket.solved = !foundTicket.solved;
            foundTicket.save();
            res.redirect("/ticket/" + foundTicket._id);
        }
    });
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;