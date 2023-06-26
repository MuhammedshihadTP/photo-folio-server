const express = require('express');
const router = express.Router();

const userController=require('../controllers/user')
const { tryCatch } = require('../utils/tryCatch');
const {  tokenVerify} = require('../utils/jwtToken')
const {upload}=require('../helpers/multer')


router.route('/signup')
.post( tryCatch(userController.register))

router.route('/login')
.post(tryCatch(userController.loogin))

router.route('/image')
.post(tokenVerify,upload.single('image'),tryCatch(userController.addImage))
.get(tokenVerify,tryCatch(userController.getImage))


module.exports =router
