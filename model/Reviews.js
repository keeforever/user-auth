const mongoose = require('mongoose')
const {Schema,model} = mongoose

const reviewSchema = new Schema({
  rating:{
    type: Number,
    required : [true,"Stars must be provided !!!"]
  },
  title : {
    type : String,
    required : [true,'Title must be provided !!!']
  },
  comment:{
    type: String,
    required : [true, "Comment must b provided !!!"]
  },
  user : {
    type: mongoose.Types.ObjectId,
    ref : 'Users',
    required: true
  },
  product : {
    type: mongoose.Types.ObjectId,
    ref : 'Products',
    required: true
  }
})

reviewSchema.index({user:1},{product:1},{unique:true})

reviewSchema.statics.getAverageOfReviews = async function(productId){
  console.log(productId)
  const agg = await Reviews.aggregate([
    {
      '$match': {
        'product': productId
      }
    }, {
      '$group': {
        '_id': null, 
        'averageRating': {
          '$avg': '$rating'
        }, 
        'numOfReviews': {
          '$count': {}
        }
      }
    }
  ])
  try{
    await this.model("Products").findOneAndUpdate({_id:productId.toString()},{
      averageRating: agg[0]?.averageRating || 0,
      numOfReviews: agg[0]?.numOfReviews || 0,
    })
  }catch(error){
    console.log(error);
  }
}

reviewSchema.post('save',function(){
  this.constructor.getAverageOfReviews(this.product)
})

reviewSchema.post('remove',function(){
  this.constructor.getAverageOfReviews(this.product)
})

const Reviews = model('Reviews',reviewSchema)

module.exports = Reviews