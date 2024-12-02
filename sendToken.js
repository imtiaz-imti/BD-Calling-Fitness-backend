const sendToken = (userNew,statusCode,res)=>{
    const token = userNew.getJWTToken()
    const options = {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: '/',
          expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000)
    }
    return res.status(statusCode).cookie('token',token,options).json({success:true,message:'user logged in successfully',token,userNew:userNew._id})
}
module.exports = sendToken