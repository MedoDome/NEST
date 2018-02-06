var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();

    mongoose.connect("mongodb://localhost/nest_ticket");
app.set("view engine","ejs")
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

/* Ticket model */

var ticketSchema = new mongoose.Schema({
    title: String,
    solved: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

var Tickets = mongoose.model("Ticket",ticketSchema);

// Tickets.create({
//     title: "Ticket 1",
// });
app.get("/", function(req,res){
    res.redirect("/ticket");
    // console.log(req);
    // console.log(res);
});

/*
========= TICKET ROUTE =========
Name    Path                HTTP    Desc

Index   /ticket             GET     List all tickets
New     /ticket/new         GET     Show post form
Create  /ticket/            POST    Create new ticket
Show    /ticket/:id         GET     Show ticket
Edit    /ticket/:id/edit    GET     Show edit form
Update  /ticket/:id         PUT     Update ticket
Destroy /ticket/:id         DELETE  Delete ticket

*/

app.get("/ticket", function(req,res){
    Tickets.find({}, function(err, tickets){
        if(err){
            res.send("404");
            console.log("Error: " + err);
        }
        else{
            console.log(tickets);
            res.render("list",{tickets: tickets});
        }
    });
   
    // console.log(req);
    // console.log(res);
});

app.get("/ticket/new", function(req,res){
    res.send("Ticket List");
    // console.log(req);
    // console.log(res);
});

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
