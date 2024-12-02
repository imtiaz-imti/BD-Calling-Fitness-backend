const app = require('./app')
const dotenv = require('dotenv')
dotenv.config({path:'config.env'})
process.on('uncaughtException',(err)=>{
   console.log(`Error:${err.message}`)
   console.log('shutting down the server')
   process.exit(1)
})
const server = app.listen(4000,()=>{
   console.log('server is running') 
})
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://imtiaz:OFYwf4UzbsZViAeV@cluster0.sbnwu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=>{
    console.log('connected')
}).catch((err)=>{
   console.log(err) 
})