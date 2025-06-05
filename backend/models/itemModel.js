const mongoose=require('mongoose')

const itemSchema=mongoose.Schema({
        name:{type:String, required:[true,'item name cant be empty'], unique:[true, 'category already exists!']},
        description:{type:String,required:true},
        price:{type:mongoose.Schema.Types.Decimal128,required:true},
        imageUrl: {type: String,required: true},
        rating: [{
          user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          value:{
            type:Number,
            min:1,
            max:5,
          }
          }],
    },
    {timestamps:true}
);
itemSchema.query.liked=function(userId){
    return this.where({likes:userId})
};

itemSchema.virtual('averageRating').get(function() {
  if (this.rating.length === 0) return 0;
  const sum = this.rating.reduce((acc, curr) => acc + curr.value, 0);
  return sum / this.rating.length;
});

itemSchema.set('toJSON', { virtuals: true });
itemSchema.set('toObject', { virtuals: true });
  

module.exports=mongoose.model('Item',itemSchema)