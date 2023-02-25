const express = require('express');
const passport = require('passport');
const router = express.Router();
const chatController = require('../controller/groupChatController');

// @get request for fetch groups in which id is preset itself
router.get('/getGroupByUser', passport.authenticate('jwt' , {session : true}), chatController.getMyGroups);

// @post request for creating group chat
router.get('/groups' , chatController.groups);

// @post request for creating group chat
router.post('/createGroupChat' , chatController.create);


// @port request for creating message
router.post('/send_message' , chatController.send_message)


module.exports = router;