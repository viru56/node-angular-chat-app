var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var RoomSchema = new mongoose.Schema({

    connection: {
        type: String, // sender + receiver
        index: true,
        unique: true,
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
    unreadMessage: {
        type: Number,
        default: 1
    }

}, { timestamps: true, versionKey: false });

// RoomSchema.plugin(uniqueValidator, { message: "is already taken." })

RoomSchema.methods.toJSON = function () {
    return {
        connection: this.connection,
        sender: this.sender,
        receiver: this.receiver,
        unreadMessage: this.unreadMessage
    };
};
mongoose.model('Room', RoomSchema);