const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const model = new mongoose.Schema({
   name:{
     type:String,
     required:[true,'please enter your name'],
     maxLength:[30,'name cannot exceed 30 characters'],
     minLength:[4,'name should have 4 characters or more']
   },
   email:{
    type:String,
    required:[true,'please enter your email'],
    unique: [true,'this email already exist'],
    validate:[validator.isEmail,'please enter a valid email']
  },
  password:{
    type:String,
    required:[true,'please enter your password'],
    minLength:[8,'password should have 8 characters or more'],
    select:false
  },
  role:{
    type:String,
    default:'trainees'
  },
  wantToTrainerNotificationCount:{
    type:Number,
    default:0
  },
  wantToAdminNotificationCount:{
    type:Number,
    default:0
  },
  adminShowTrainerAvailable:[{
    startTime:{
      type:String,
      required: true,
     },
     endTime:{
      type:String,
      required: true,
     },
     trainerName:{
      type:String,
      required: true,
     }
  }],
  wantToTrainer:[{
    name:{
      type:String,
      required: true,
    },
    id:{
      type:String,
      required: true,
    }
  }],
  wantToAdmin:[{
    name:{
      type:String,
      required: true,
    },
    id:{
      type:String,
      required: true,
    }
  }],
  mySchedule:[{
    startTime:{
      type:String,
      required: true,
     },
     endTime:{
      type:String,
      required: true,
     },
     trainerName:{
      type:String,
      required: true,
     }
  }],
  trainerAvailable:[{
     startTime:{
      type:String,
      required: true,
     },
     endTime:{
      type:String,
      required: true,
     },
     time:{
      type:String,
      required: true,
     }
  }],
  trainerBookedByTrainees:[{
    startTime:{
      type:String,
      required: true,
     },
     endTime:{
      type:String,
      required: true,
     },
     time:{
      type:String,
      required: true,
     },
     id:{
      type:String,
      required: true,
     },
     name : {
      type:String,
      required: true,
     }
  }]
})
model.pre('save',async function(next){
  if(!this.isModified('password')){
    next()
  }
  this.password = await bcrypt.hash(this.password,10)
})
model.methods.getJWTToken = function(){
  return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
}
model.methods.comparePassword = async function(currentPassword){
  return await bcrypt.compare(currentPassword,this.password)
}
module.exports = mongoose.model('model',model)