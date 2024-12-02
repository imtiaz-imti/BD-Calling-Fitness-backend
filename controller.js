const sendToken = require('./sendToken')
const model = require('./model')
const ErrorHandler = require('./errorHandler')
const createUser = async (req,res,next)=>{
   try{ 
     console.log(req.body) 
     const {name,email,password} = req.body
     const userNew = await model.create({
        name,
        email,
        password,
     })
     sendToken(userNew,201,res)
   }catch(err){  
    console.log(err.message)     
    return next(new ErrorHandler(err.message,404).setCode(err.code))
   }
}
const loginUser = async (req,res,next)=>{  
   try{ 
     const {email,password} = req.body
     if(!email || !password){return next(new ErrorHandler('please enter email and password',400))}
     const userNew = await model.findOne({email}).select('+password')
     if(!userNew){return next(new ErrorHandler('invalid email or password',401))}
     if(!await userNew.comparePassword(password)){return next(new ErrorHandler('invalid email or password',401))}
     sendToken(userNew,200,res) 
   }catch(err){
    console.log(err.message)  
    return next(new ErrorHandler(err.message,404))
   }
}
 const makeAdmin = async (req,res,next)=>{
   try{
      const user = await model.findById(req.body.id)
      user.role = "admin"
      await user.save({validateBeforeSave:false})
      res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({success:true,message:'role changed successfully'})
    }catch(err){
     return next(new ErrorHandler(err.message,404))
    }
 }
 const requestAdmin = async (req,res,next)=>{
   try{
      const requestUser = await model.findById(req.body.id)
      const users = await model.find()
      users.forEach(async (user) => {
         if(user.role === 'admin'){
            user.wantToAdminNotificationCount+=1
            user.wantToAdmin = [...user.wantToAdmin,{name:requestUser.name,id:String(requestUser._id)}]
            await user.save({validateBeforeSave:false})
         } 
      })
      res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({success:true,message:'request send to admin'})
    }catch(err){
     return next(new ErrorHandler(err.message,404))
    }
 }
 const makeTrainer = async (req,res,next)=>{
   try{
      const user = await model.findById(req.body.id)
      user.role = "trainer"
      await user.save({validateBeforeSave:false})
      res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({success:true,message:'role changed successfully'})
    }catch(err){
     return next(new ErrorHandler(err.message,404))
    }
 }
 const requestTrainer = async (req,res,next)=>{
   try{
      const requestUser = await model.findById(req.body.id)
      const users = await model.find()
      users.forEach(async (user) => {
         if(user.role === 'admin'){
            user.wantToTrainerNotificationCount+=1
            user.wantToTrainer = [...user.wantToTrainer,{name:requestUser.name,id:String(requestUser._id)}]
            await user.save({validateBeforeSave:false})
         } 
      })
      res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({success:true,message:'request send to admin'})
    }catch(err){
     return next(new ErrorHandler(err.message,404))
    }
 }
 const deleteNotificationCountTrainer = async (req,res,next)=>{
   try{
      const user = await model.findById(req.body.id)
      user.wantToTrainerNotificationCount = 0
      await user.save({validateBeforeSave:false})
      res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({success:true,message:'notification deleted'})
    }catch(err){
     return next(new ErrorHandler(err.message,404))
    }
 }
 const deleteNotificationCountAdmin = async (req,res,next)=>{
   try{
      const user = await model.findById(req.body.id)
      user.wantToAdminNotificationCount = 0
      await user.save({validateBeforeSave:false})
      res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({success:true,message:'notification deleted'})
    }catch(err){
     return next(new ErrorHandler(err.message,404))
    }
 }
 const deleteNotificationTrainer = async (req,res,next)=>{
   try{
      const user = await model.findById(req.body.admin_id)
      let newList = []
      user.wantToTrainer.forEach(user => {
          if(user.id !== req.body.id){
            newList.push(user)
          }
      })
      user.wantToTrainer = [...newList]
      await user.save({validateBeforeSave:false})
      res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({success:true,message:'notification deleted'})
    }catch(err){
     return next(new ErrorHandler(err.message,404))
    }
 }
 const deleteNotificationAdmin = async (req,res,next)=>{
   try{
      const user = await model.findById(req.body.admin_id)
      let newList = []
      user.wantToAdmin.forEach(user => {
          if(user.id !== req.body.id){
            newList.push(user)
          }
      })
      user.wantToAdmin = [...newList]
      await user.save({validateBeforeSave:false})
      res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({success:true,message:'notification deleted'})
    }catch(err){
     return next(new ErrorHandler(err.message,404))
    }
 }
 const getUserDetails = async (req,res,next)=>{
   try{
      const newUser = await model.findById(req.params.id)
      // setHeader('Access-Control-Allow-Origin', '*')
      res.status(200).json({success:true,newUser})
   }catch(err){
      return next(new ErrorHandler(err.message,404))
   }
}
const requestTrainerList = async (req,res,next)=>{
   try{
      const newUser = await model.findById(req.params.id)
      res.status(200).json({success:true,data:newUser.wantToTrainer})
   }catch(err){
      return next(new ErrorHandler(err.message,404))
   }
}
const bookTrainerList = async (req,res,next)=>{
   try{
      const users = await model.find()
      let data = []
      users.forEach(user => {
         if(user.role === 'trainer'){
           data.push(user) 
         }
      })
      res.status(200).json({success:true,data})
   }catch(err){
      return next(new ErrorHandler(err.message,404))
   }
}
const requestAdminList = async (req,res,next)=>{
   try{
      const newUser = await model.findById(req.params.id)
      res.status(200).json({success:true,data:newUser.wantToAdmin})
   }catch(err){
      return next(new ErrorHandler(err.message,404))
   }
}
const allTrainerList = async (req,res,next)=>{
   try{
      const users = await model.find()
      let data = []
      users.forEach(user => {
        if(user.role === 'trainer'){
           data.push(user)
        } 
      })
      res.status(200).json({success:true,data})
   }catch(err){
      return next(new ErrorHandler(err.message,404))
   }
}
const markAvailable = async (req,res,next)=>{
   try{
      const user = await model.findById(req.body.id)
      user.trainerAvailable = [...user.trainerAvailable,{startTime:req.body.startTime,endTime:req.body.endTime,time:req.body.time}]
      await user.save({validateBeforeSave:false})
      res.status(200).json({success:true,message:'available marked'})
   }catch(err){
      return next(new ErrorHandler(err.message,404))
   }
}
const bookTrainer = async (req,res,next)=>{
   try{
      const user = await model.findById(req.body.trainer_id)
      user.trainerBookedByTrainees = [...user.trainerBookedByTrainees,{startTime:req.body.startTime,endTime:req.body.endTime,time:req.body.time,id:req.body.trainees_id,name:req.body.name}]
      await user.save({validateBeforeSave:false})
      res.status(200).json({success:true,message:'available marked'})
   }catch(err){
      return next(new ErrorHandler(err.message,404))
   }
}
const deleteTrainer = async (req,res,next)=>{
   try{
      const data = await model.findById(req.body.id)
      await model.deleteOne(data)
      res.status(200).json({success:true,message:'delete successfully'})
   }catch(err){
      return next(new ErrorHandler(err.message,404))
   }
}
module.exports = {createUser,loginUser,makeAdmin,requestAdmin,makeTrainer,requestTrainer,deleteNotificationCountTrainer,deleteNotificationCountAdmin,deleteNotificationTrainer,deleteNotificationAdmin,getUserDetails,requestTrainerList,requestAdminList,allTrainerList,markAvailable,bookTrainerList,bookTrainer,deleteTrainer}