const asyncHandler=require('express-async-handler')

const Post=require('../models/postModel')

const getPosts=asyncHandler(async(req,res)=>{
    const posts=await Post.find()
    res.status(200).json(posts)
})

const getActivePosts=asyncHandler(async(req,res)=>{
    const posts=await Post.find().active().populate('category','name').populate('author','name').populate({path: 'comments',
        populate: {
          path: 'author',
          select: 'name'}}).lean();
    res.status(200).json(posts)
})

const getBlockedPosts=asyncHandler(async(req,res)=>{
    const posts=await Post.find().blocked().populate('category','name').populate('author','name').populate({path: 'comments',
        populate: {
          path: 'author',
          select: 'name'}}).lean();
    res.status(200).json(posts)
})

const getOwnPosts=asyncHandler(async(req,res)=>{
    const posts=await Post.find({author:req.user.userId}).populate('category','name').populate('author','name').populate({path: 'comments',
        populate: {
          path: 'author',
          select: 'name'}}).lean();
    res.status(200).json(posts)
})

const getLikedPosts=asyncHandler(async(req,res)=>{
    const posts=await Post.find().liked(req.user.userId).active()
    res.status(200).json(posts)
})
const moderatePost = asyncHandler(async (req, res) => {
    
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Determine new status (toggle current status)
    const isCurrentlyBlocked = post.status === 'blocked';
    const newStatus = isCurrentlyBlocked ? 'active' : 'blocked';

    // Prepare update
    const update = { 
        status: newStatus,
        updatedAt: new Date() 
    };

    const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        message: `Post ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`,
        post: updatedPost
    });
});


const postPost=asyncHandler(async(req,res)=>{
    const { title, description, imageUrl, category, price } = req.body;

    if (!title || !description || !imageUrl || !category || !price) {
        res.status(400);
        throw new Error('Please include all required fields');
    };

    const post=await Post.create({
        title,
        description,
        imageUrl,
        category,
        price,
        author: req.user.userId, // Automatically set from authenticated user
    })
    res.status(200).json(post)
})
// put => overwrite whole existing target. Patch only changes specific values of target
const putPost=asyncHandler(async(req,res)=>{
    const post=await Post.findById(req.params.id)
    if(!post){
        res.status(400)
        throw new Error('Post not found')
    }
    if(post.author.toString() === req.user.userId.toString() || req.user.role === "admin"){
        const updatedPost=await Post.findByIdAndUpdate(req.params.id,req.body,{
            new:true
        })
        res.status(200).json(updatedPost)
    } else{
        res.status(403);
        throw new Error('Not authorized to edit this post')
    }
})

const deletePost=asyncHandler(async(req,res)=>{
    const post=await Post.findById(req.params.id)
    if(!post){
        res.status(400)
        throw new Error('Post not found')
    }
    if(post.author.toString() === req.user.userId.toString() || req.user.role === "admin"){
        await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({id:req.params.id})
    } else{
        res.status(403);
        throw new Error('Not authorized to delete this post')
    }
})



module.exports={getPosts,postPost,putPost,deletePost,moderatePost, getActivePosts, getBlockedPosts,getLikedPosts,getOwnPosts}