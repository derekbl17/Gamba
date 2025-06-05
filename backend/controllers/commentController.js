const asyncHandler=require('express-async-handler')
const Comment=require('../models/commentModel')
const Post=require('../models/postModel')

//content - postid - authorid

const createComment=asyncHandler(async(req,res)=>{
    const postId=req.params.id
    const userId=req.user.userId
    const {content}=req.body

    if (!postId || !userId || !content){
        res.status(400).json({message:"no post/user id/content"})
    }

    const comment=await Comment.create({
        content,
        post:postId,
        author:userId
    })
    res.status(200).json(comment)
})

const deleteComment=asyncHandler(async(req,res)=>{
    const commentId=req.params.id
    const userId=req.user.userId

    const comment = await Comment.findById(commentId)
    .populate('author', '_id') // Populate comment author
    .populate({
      path: 'post',
      select: 'author',
      populate: {
        path: 'author',
        select: '_id'
      }
    });

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  // 2. Check authorization
  const isCommentAuthor = comment.author?._id.equals(userId);
  const isPostAuthor = comment.post?.author?._id.equals(userId);

  if (!isCommentAuthor && !isPostAuthor && req.user.role!=='admin') {
    return res.status(403).json({ 
      message: "Unauthorized - You must be the comment author or post owner or admin" 
    });
  }

  // 3. Delete the comment
  await Comment.deleteOne({ _id: commentId });

  // 4. Optionally: Remove comment reference from post (if you have this relation)
  await Post.updateOne(
    { _id: comment.post._id },
    { $pull: { comments: commentId } }
  );

  res.status(200).json({ message: "Comment deleted successfully" });
})

module.exports={
    createComment,
    deleteComment
}