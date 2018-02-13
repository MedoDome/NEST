var mongoose = require("mongoose");
var ticketSchema = new mongoose.Schema({
    title: String,
    message: String,
    solved: {type: Boolean, default: false},
    created: {type: Date, default: Date.now},
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TicketComment' }]
});

module.exports = mongoose.model("Ticket",ticketSchema);