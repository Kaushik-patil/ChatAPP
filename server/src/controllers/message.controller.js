import User from "../models/user.model.js";
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js'
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req,res) =>{
 try {
     const loggedInUserId =  req.user._id;
     const filteredUsers = await User.find({_id  : {$ne:loggedInUserId}}).select("-password");
     res.status(200).json(filteredUsers);
 } catch (error) {
   console.log("Error in getUsersForSidebar ", error.message);
   res.status(500).json({error : "Internal Server Error"});
       
 }
}

export const getMessages = async (req, res) =>{
 try {
     const {id:userToChatId} = req.params
     const myId = req.user._id;

     const messages = await Message.find({
        $or:[
            {senderID:myId , receiverId : userToChatId},
            {senderID:userToChatId , receiverId :myId}
        ]
     })

     res.status(200).json(messages)
 } catch (error) {
    console.log("Error in getMessages controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
 }
}

export const sendMessage = async (req,res) =>{
    try {
         const {image ,text} = req.body ;
         const {id:receiverId} = req.params;
         const senderID = req.user._id;

         let imageUrl ;
         if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url ;
         }

         const newMessage  = Message ({
            senderID,
            receiverId,
            text,
            image : imageUrl,
         });

         await newMessage.save();
         //todo: realtime functionality goes here with help of wbsocket.io
         const receiverSocketId = getReceiverSocketId(receiverId);

         if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage',newMessage)
         }


         res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

