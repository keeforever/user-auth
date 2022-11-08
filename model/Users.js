const validator = require('validator')

const mongoose = require('mongoose')
const {Schema,model} = mongoose

const bcrypt = require('bcryptjs')

// User schema

const UserSchema = new Schema({
  name:{
    type : String,
    required : [true,"Name Required."]
  },
  email:{
    type : String,
    validate : {
      validator : validator.isEmail,
      message : 'invalid Email.'
    },
    unique : true
  },
  password:{
    type : String,
    required : [true,"password Required."],
    minlength: 3
  },
  role:{
    type : String,
    default : 'user',
    enum : ['admin','user']
  },
  verificationToken : {
    type : String
  },
  isVerified : {
    type : Boolean,
    default : false
  },
  verified : {
    type : Date
  },
  passwordToken : {
    type: String
  },
  passwordTokenExpiryDate : {
    type : Date
  }
})

// hash password
UserSchema.pre('save',async function(){
  if(!this.modifiedPaths().includes('password')) return ;

  const genSalt = await bcrypt.genSalt(10)
  this.password =  await bcrypt.hash(this.password,genSalt)
})

// compare password
UserSchema.methods.comparePassword = async function(password){
  const isMatch = await bcrypt.compare(password,this.password)
  return isMatch;
}

// users model
const UsersModel = model("Users",UserSchema)

module.exports = UsersModel