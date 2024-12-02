const express = require('express')
const cookieParser = require('cookie-parser')
const route = require('./route')
const errorHandler = require('./errorHandler')
const sendToken = require('./sendToken')
const app = express()
const cors = require('cors')
app.use(cookieParser())
app.use(cors({
    origin:'*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
}))
app.use(express.json())
app.use('/api/v1',route)
app.use(errorHandler)
app.use(sendToken)
module.exports = app