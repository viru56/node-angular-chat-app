var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const MessageSchema = new mongoose.Schema({

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
}, { timestamps: true });

let ChatSchema = new mongoose.Schema({

    connection: {
        type: String, // sender + receiver
        index: true,
        unique: true,
        required: [true, "can't be blank"]
    },
    messages: {
        type: [MessageSchema]
    }
}, { timestamps: true });

ChatSchema.plugin(uniqueValidator, { message: "is already taken." });

ChatSchema.methods.toAuthJSON = function () {
    return {
        connection: this.connection,
        messages: this.messages,
    };
};

mongoose.model('Chat', ChatSchema);