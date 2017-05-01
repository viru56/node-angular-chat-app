var mongoose = require('mongoose');
var router = require('express').Router();

var Chat = mongoose.model('Chat');
var auth = require('../auth');
router.get('/:receiver', auth.required, (req, res, next) => {
    var findQuery = {
        $or: [
            { connection: req.payload.id + req.params.receiver },
            { connection: req.params.receiver + req.payload.id }
        ]
    }
    var projection = { '_id': 0, 'connection': 1, 'messages': 1 };
    Chat.findOne(findQuery, projection).then(data => {
        return res.json({ data });
    }).catch(next)
});

router.post('/', auth.required, (req, res, next) => {
    var chat = new Chat();
    chat.connection = req.body.chat.sender + req.payload.id;
    chat.messages = [{
        sender: req.body.chat.sender,
        receiver: req.payload.id,
        content: req.body.chat.content
    }];
    chat.save().then((data) => {
        return res.json({ data: chat.toAuthJSON() });
    }).catch(next);
});
router.put('/', auth.required, (req, res, next) => {
    var findQuery = { connection: req.body.chat.connection };
    var newMessage = {
        sender:  req.body.chat.sender,
        receiver:req.payload.id,
        content: req.body.chat.content
    }
    Chat.findOne(findQuery).then(chat => {
        chat.messages.push(newMessage);
        return chat.save().then((updatedData) => {
            return res.json({ 'message': 'Saved new message.' });
        });
    }).catch(next);
});

module.exports = router;