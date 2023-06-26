const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const morgen=require('morgan')
require('dotenv').config();


const db_url = process.env.MONGODB_URL

mongoose.connect(db_url).then(() => {
    console.log('Connected to MongoDB')
}).catch((error) => {
    console.log('Error connecting to MongoDB', error.message)
})


app.use(express.json())
app.use(cors())
app.use(morgen('dev'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


const User=require('./routers/users')
app.use('/api/user',User)
module.exports = app