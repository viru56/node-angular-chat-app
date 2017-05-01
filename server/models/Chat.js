var mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({

    connection: {
        type: String, // sender + receiver
        index: true,
        required: [true, "can't be blank"]
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "can't be blank"]
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "can't be blank"]
    },
    content: {
        type: String,
        required: [true, "can't be blank"]
    },
    unread: {
        type: String,
        default: false
    }
}, { timestamps: true, versionKey: false });

mongoose.model('Chat', ChatSchema);