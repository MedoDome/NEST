var express = require("express");
var router = express.Router({mergeParams: true});

var Tickets         = require("../models/ticket"),
    TicketComments  = require("../models/ticketComment");

router.get("/:id/comment/new", function(req,res) {
    res.send("This will redirect");
});

router.post("/:id/comment/", function(req, res){    
    req.body.ticketComment.body = req.sanitize(req.body.ticketComment.body);
    req.body.ticketComment.author = req.user._id;

    Tickets.findById(req.params.id, function(err, ticket){
        if(err){
            console.log("Ticket not found");
            res.redirect("/ticket/")
        }
        else{
            TicketComments.create(req.body.ticketComment, function(err, comment){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("WE ARE ADDING");
                    ticket.comments.push(comment._id);
                    ticket.save();
                    res.redirect("/ticket/" + ticket._id);
                }
            });

        }
    });
});

/** TicketComments edit routes */

router.get("/:id/comment/:cid/edit", function(req,res){

    TicketComments.findById(req.params.cid, function(err, foundComment){
        if(err){ res.redirect("/"); }
        else { res.render("ticketComment/edit", {ticketComment: foundComment, ticketId : req.params.id });}
    });
});

router.put("/:id/comment/", function(req,res){
    console.log(req.body);
    TicketComments.findByIdAndUpdate(req.body.ticketComment._id,req.body.ticketComment, function(err, updatedTicket){
        if(err){
            res.redirect("/ticket/");
        }
        else{
            res.redirect("/ticket/" + req.params.id);
        }
    });
});

/**  Ticket delete routes */

router.delete("/:id/comment/:cid", function(req,res){
    TicketComments.findByIdAndRemove(req.params.cid, function(err, foundTicket){
        /** Fix redirect @TODO */
        if(err){ res.redirect("/ticket/" + req.params.id); }
        else { res.redirect("/ticket/" + req.params.id);}
    });
});


module.exports = router;