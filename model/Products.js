const mongoose = require('mongoose')
const {Schema,model} = mongoose

const ProductSchema = new Schema({
  name : {
    type : String,
    required:[true,'Name required !'],
    maxlength: 100
  },
  price : {
    type : Number,
    required:[true,'price required !'],
    default: 0
  },
  description:{
    type: String,
    required: [true,'Description requires'],
    maxlength: 1000
  },
  image:{
    type:String,
    default: './uploads/default.png'
  },
  category : {
    type : String,
    required : [true, 'Category required'],
    enum: ['office', 'kitchen', 'bedroom']
  },
  company: {
    type: String,
    required : [true,'Company required !'],
    enum : ['ikea','liddy','marcos']
  },
  color:{
    type: [String],
    default:['#1ed760'],
    required : [true,'Color required']
  },
  featured:{
    type: Boolean,
    default: false
  },
  freeShipping :{
    type: Boolean,
    default: false
  },
  inventory:{
    type: String,
    default: ' ',
  
  },
  averageRating : {
    type : Number,
    default : 0
  },
  numOfReviews :{
    type : Number,
    default: 0
  },
  user : {
    type: mongoose.Types.ObjectId,
    ref : 'Users',
    required: true
  }
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}}
)

// review virtual
ProductSchema.virtual("review",{
  ref : 'Reviews',
  localField : '_id',
  foreignField : 'product',
  justOne : false
})

ProductSchema.pre('remove',async function (){
  await this.model('Reviews').deleteMany({product: this._id})
})

const Products = model('Products',ProductSchema)

module.exports = Products