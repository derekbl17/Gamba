const mongoose=require('mongoose')

const postSchema = new mongoose.Schema({
    // Core Fields
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      maxlength: 500
    },
    imageUrl: {
      type: String,
      required: true,
      // validate: {
      //   validator: v => /^(https?:\/\/).+\.(jpg|jpeg|png|webp|gif)$/i.test(v),
      //   message: props => `${props.value} is not a valid image URL!`
      // }
    },
    price:{type:mongoose.Schema.Types.Decimal128,required:true},
    // Relationships
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    // Metadata
    status: {
      type: String,
      enum: {
        values: ['active', 'blocked'],
        message: 'Status must be either active or blocked'
      },
      default: 'active'
    },
    blockedReason: {
      type: String,
      select: false, // Only visible to admins
      maxlength: 500
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default:[]
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }, {
    timestamps:true,
    toJSON: { virtuals: true },  // Include virtuals when converting to JSON
    toObject: { virtuals: true } // Include virtuals when converting to objects
  });
  
  // Virtual for Comments
  postSchema.virtual('comments', {
    ref: 'Comment',          // The model to use
    localField: '_id',       // Find comments where `localField`
    foreignField: 'post',    // is equal to `foreignField`
    justOne: false           // Set to false for array of comments
  });
  
  // Indexes
  postSchema.index({ title: 'text', description: 'text' });
  postSchema.index({ createdAt: -1 });
  postSchema.index({ category: 1 });

  // Query Helpers
postSchema.query.active = function() {
  return this.where({ status: 'active' });
};

postSchema.query.blocked = function() {
  return this.where({ status: 'blocked' });
};
postSchema.query.liked=function(userId){
  return this.where({likes:userId})
}

postSchema.pre('findOneAndDelete', async function(next) {
  const post = await this.model.findOne(this.getFilter());
  await mongoose.model('Comment').deleteMany({ post: post._id });
  next();
});
  
module.exports=mongoose.model('Post',postSchema)