const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const ChatModel = require("../models/ChatModel");
const UserModel = require("../models/UserModel");

//GET ALL CHATS

router.get("/", authMiddleware, async(req, res)=>{
    try{
        const {userId} = req

        const user = await ChatModel.findOne({user: userId})
        .populate('chats.messageWith');

        let chatsToBeSent=[];
        if(user.chats.length >0){
            chatsToBeSent = await user.chats.map(chat =>({
                messagesWith: chat.messagesWith._id,
                name: chat.messagesWith.name,
                profilePicUrl: chat.messagesWith.profilePicUrl,
                lastMessage: chat.messages[chat.messages.length-1].msg,
                date: chat.messages[chat.messages.length-1].date
            }))
        }

        return res.json(user.chats);

    }catch(error){

    }
})
module.exports = router
