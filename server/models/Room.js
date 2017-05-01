var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const ReceiverSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
         required: [true, "can't be blank"]
    },
    unreadMessage: {
        type: Number,
        default: 0
    }
});
const RoomSchema = new mongoose.Schema({

    connection: {
        type: String, // sender + receiver
        index: true,
        unique: true,
        required: [true, "can't be blank"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "can't be blank"]
    },
    receivers: [ReceiverSchema]

}, { timestamps: true, versionKey: false });

RoomSchema.plugin(uniqueValidator, { message: "is already taken." })

RoomSchema.methods.toJSON = function () {
    return {
        connection: this.connection,
        sender: this.sender,
        receivers: this.receivers
    };
};
mongoose.model('Room', RoomSchema);