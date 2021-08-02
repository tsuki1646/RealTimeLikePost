const express=require('express');
const router=express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const UserModel = require('../models/PostModel')
const FollowerModel = require('../models/FollowerModel');
const PostModel = require('../models/PostModel');
//const { uniqueId } = require('lodash-es');
const uuid = require("uuid").v4;

// CREATE A POST
router.post("/", authMiddleware, async (req, res) => {
  const { text, location, picUrl } = req.body;

  if (text.length < 1)
    return res.status(401).send("Text must be atleast 1 character");

    try {
        const newPost = {
            user: req.userId,
            text
        };
        if (location) newPost.location = location;
        if (picUrl) newPost.picUrl = picUrl;

        const post = await new PostModel(newPost).save();

        const postCreated = await PostModel.findById(post._id).populate("user");

        return res.json(postCreated);
        //return res.json(post._id);

    } catch (error) {
        console.error(error);
        return res.status(500).send(`Server error`);
    }
});

//GET ALL POSTS
router.get("/", authMiddleware, async(req, res)=>{
    try{
        const posts = await PostModel.find()
            .sort({createdAt: -1})
            .populate("user")
            .populate("comments.user");
        return res.json(posts);
    }catch(error){
        console.log(error)
        return res.status(500).send(`Server error`);
    }
});

//GET POST BY ID
router.get("/:postId", authMiddleware, async(req, res) =>{
    try {
        const post = await PostModel.findById(req.params.postId)
            .populate("user")
            .populate("comments.user");

        if(!post){
            return res.status(404).send("Post not found")
        }
        return res.json(post);
    }catch (error){
        console.error(error);
        return res.status(500).send(`Server error`);
    }
});

//DELETE POST
router.delete("/:postId", authMiddleware, async (req, res) =>{
    try {
        const {userId} = req;
        const {postId} = req.params;

        const post = await PostModel.findById(postId);
        if(!post){
            return res.status(404).send("post not found");
        }

        const user = await UserModel.findById(userId);

        if(post.user.toString() !== userId){
            if(user.role === 'root'){
                await post.remove()
                return res.status(200).send('Post deleted successfully')
            }else{
                return res.status(401).send("Unauthorized")
            }
        }

        await post.remove()
        return res.status(200).send('Post deleted successfully')

    } catch(error){
        console.error(error);
        return res.status(500).send(`Server error`);
    }
});

// LIKE A POST
router.post('/like/:postId', authMiddleware, async(req, res) =>{
    try {
        const {postId} = req.params;
        const {userId} = req;

        const post = await PostModel.findById(postId);
        if(!post){
            return res.status(404).send("No Post found")
        }

        const isLiked = post.likes.filter(like=>like.user.toString() === userId).length >0;

        if(isLiked){
            return res.status(401).send("Post already liked");
        }
        await post.likes.unshift({user: userId});
        await post.save();

        return res.status(200).send("Post liked");
    }catch(error){
        console.error(error);
        return res.status(500).send(`Server error`);
    }
});

// UNLIKE A POST
router.post('/unlike/:postId', authMiddleware, async(req, res) =>{
    try {
        const { postId } = req.params;
        const { userId } = req;

        const post = await PostModel.findById(postId);
        if(!post){
            return res.status(404).send("No Post found")
        }

        const isLiked = post.likes.filter(like=>like.user.toString() === userId).length === 0;

        if(isLiked){
            return res.status(401).send("Post not liked before");
        }

        const index = post.likes.map(like =>like.user.toString()).indexOf(userId);

        //await post.likes.unshift({user: userId});
        await post.likes.splice(index, 1);
        await post.save();

        return res.status(200).send("Post unliked");
    }catch(error){
        console.error(error);
        return res.status(500).send(`Server error`);
    }
});

//GET ALL LIKES OF A POST
router.get("/like/:postId", authMiddleware, async (req, res) =>{
    try {
        const { postId } = req.params;
        const post = await PostModel.findById(postId).populate("likes.user");
        if (!post) {
            return res.status(404).send("No Post found");
        }
        return res.status(200).json(post.likes);

    }catch (error){
        console.error(error);
        return res.status(500).send(`Server error`);
    }
});

//CREATE A COMMENT
router.post("/comment/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const { text } = req.body;

    if (text.length < 1)
      return res.status(401).send("Comment should be atleast 1 character");

    const post = await PostModel.findById(postId);

    if (!post) return res.status(404).send("Post not found");

    const newComment = {
      _id: uuid(),
      text,
      user: req.userId,
      date: Date.now()
    };

    await post.comments.unshift(newComment);
    await post.save();

    return res.status(200).json(newComment._id);
    //return res.status(200).send("Comment added");
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

//DELETE A COMMENT
router.delete('/:postId/:commentId', authMiddleware, async(req, res)=>{
    try {
        const {postId, commentId} = req.params;
        const {userId} = req

        const post = await PostModel.findById(postId);
        if(!post) return res.status(404).send("Post not found");

        const comment = post.comments.find(comment =>comment._id=== commentId);

        if(!comment){
            return res.status(404).send("No Comment found");
        }

        const user = await UserModel.findById(userId);

        const deleteComment = async()=>{
            const indexOf = post.comments.map(comment=>comment._id).indexOf(commentId);

            await post.comments.splice(indexOf, 1);

            await post.save();

            return res.status(200).send("Deleted successfully");
        }

        if(comment.user.toString() !== userId){
            if(user.role === "root"){
                await deleteComment();
            }else{
                return res.status(401).send("Unauthorized");
            }
        }

        await deleteComment();

    } catch (error) {
        console.error(error);
        return res.status(500).send(`Server error`);
    }
})

module.exports=router;