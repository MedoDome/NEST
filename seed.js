var mongoose = require("mongoose");
var Ticket = require("./models/ticket");
var TicketComment = require("./models/ticketComment")
var data = [

        {
            title: "Ticket 1",
            message: "I tried to restart, to reboot but ntn"
        },

        {
            title: "Ticket 2",
            message: "I tried to ssh"
        },

        {
            title: "Ticket 3",
            message: "Lorem IpsumLorem IpsumLorem Ipsum"
        },

        {
            title: "Ticket 4",
            message: "Lorem IpsumLorem IpsumLorem IpsumLorem IpsumLorem Ipsum"
        }

];

function seedDB() {
    Ticket.remove({}, function (err) {
        if (err) {
            console.log("There is error with Ticket seed");
            console.log(err);
        }
        console.log("Tickets removed");
    });
    data.forEach(function(seed){
        Ticket.create(seed, function(err, ticket){
            if(err){
                console.log("There is error with Ticket adding");
                console.log(err);
            }
            else{
                console.log("Ticket added");
                TicketComment.create({
                    message : "Have You Tried This!!!"
                }, function(err, comment){
                    if(err){
                        console.log("There is error with comments");
                    }
                    else{
                        ticket.comments.push(comment._id);
                        ticket.save();
                        console.log("Commend added and linked");
                    }
                });
            }
        });
    });
}
module.exports = seedDB;