const asyncHandler=require('express-async-handler')
const Item=require('../models/itemModel')


const addItem=asyncHandler(async(req,res)=>{
    const {name,description,price,imageUrl}=req.body.itemData

    const item=await Item.create({
        name,
        description,
        price,
        imageUrl
    })
    res.status(200).json(item)
})

const deleteItem=asyncHandler(async(req,res)=>{
    const item=await Item.findById(req.params.id)
    if(!item){
        res.status(400)
        throw new Error('Item not found')
    }

    await Item.findByIdAndDelete(req.params.id)
    res.status(200).json({id:req.params.id})
})

const getItems=asyncHandler(async(req,res)=>{
    const items=await Item.find().lean()
    const userId = req.user?.userId;

    const transformed = items.map(item => {
      const rating = item.rating || [];
    
      const average =
        rating.length > 0
          ? rating.reduce((sum, r) => sum + r.value, 0) / rating.length
          : 0;
    
      const userRating = rating.find(r => r.user.toString() === userId)?.value || 0;
    
      return {
        ...item,
        rating: {
          average: parseFloat(average.toFixed(1)),
          user: userRating,
          rateCount:rating.length
        },
      };
    });
    
    res.status(200).json(transformed);
})

const toggleLikeItem=asyncHandler(async(req,res)=>{
    const item=await Item.findById(req.params.id)
    if(!item){
        res.status(400)
        throw new Error('Item not found')
    }

    const userId = req.user.userId;
    const likeIndex = item.likes.indexOf(userId);

    // Toggle like
    if (likeIndex === -1) {
    // Add like
        item.likes.push(userId);
        await item.save();
        res.status(200).json({
            message: 'Item liked',
            likes: item.likes,
            isLiked: true
        });
    } else {
    // Remove like
        item.likes.pull(userId);
        await item.save();
        res.status(200).json({
            message: 'Post unliked',
            likes: item.likes,
            isLiked: false
        });
    }
})
const getLikedItems=asyncHandler(async(req,res)=>{
    const items=await Item.find().liked(req.user.userId)
    res.status(200).json(items)
})

const rateItem=asyncHandler(async(req,res)=>{
    const item=await Item.findById(req.params.id);
    if (!item) return res(404).json({message:'Item not found'});

    const { rating } = req.body;
  const userId = req.user.userId;

  // Validate rating value
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const existingIndex = item.rating.findIndex(r => r.user.toString() === userId);

  if (existingIndex !== -1) {
    const existingRating = item.rating[existingIndex];
    
    if (existingRating.value === rating) {
      // Remove rating (user submitted same value)
      item.rating.splice(existingIndex, 1);
    } else {
      // Update rating
      item.rating[existingIndex].value = rating;
    }
  } else {
    // Add new rating
    item.rating.push({ user: userId, value: rating });
  }

  await item.save();

  res.status(200).json({
    message: 'Rating saved',
    averageRating: item.averageRating,
    totalrating: item.rating.length,
    userRating:rating
  });
})

module.exports={addItem,deleteItem,getItems, toggleLikeItem,getLikedItems,rateItem}