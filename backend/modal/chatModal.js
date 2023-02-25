const mongoose = require('mongoose');

const groupchatSchema = mongoose.Schema({
    groupName : {
        type : 'string',
        trim : true,
        required : true,
    },
    users : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    }],
    profile_img : {
        type : String,
        default : 'https://icon-library.com/images/people-group-icon/people-group-icon-10.jpg'
    },
    groupAdmin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    messages : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'groupMessage'
    }]
});

const groupChatModal = mongoose.model('GroupChat' , groupchatSchema);
module.exports = groupChatModal;

