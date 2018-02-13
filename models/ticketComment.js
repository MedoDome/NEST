var mongoose = require("mongoose");

var ticketCommentSchema = new mongoose.Schema({
    message: String,
    created: {type: Date, default: Date.now},
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model("TicketComment",ticketCommentSchema);
