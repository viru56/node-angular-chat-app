var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({

    // connection: {
    //     type: String, // sender + receiver
    //     index: true,
    //     required: [true, "can't be blank"]
    // },
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
    }
}, { timestamps: true, versionKey: false });

mongoose.model('Chat', ChatSchema);