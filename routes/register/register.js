const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const path = require('path');
const multer = require('multer');


router.post('/getFormdata', async (req,res)=>{
  const user = new User();
  user.fname = req.body.firstName;
  user.lname = req.body.lastName;
  user.phone = req.body.phone;
  user.dob = req.body.dob;
  user.username = req.body.userName;
  try {
    // await face store
    face_store(user);
    // await voice store
    voice_store(user);
    // await otp verify
    verify_otp(user);
  } catch (error){
    // send error msg to frontend;
    throw error;
  }
  // send success msg to front end
  res.status(200).send({
    message: 'Welcome to TigerAuth!, You can now login'
  });
});

function face_store(){
  const storage = multer.diskStorage({
    destination: `./biometrics/${user.username}/`,
    filename: (req,res,next)=>{
      cb(null, Date.now() + file.extname(file.originalname));
    }
  });
  
  const upload = multer({
    storage : storage
  }).single('myImage');
  
  upload(req,res,(err)=>{
    if(err){
      throw err;
    }
    else{
      console.log(req.file);
      req.img = `/biometrics/${user.username}/${req.file.filename}`
    }
  });
}
function voice_store(){
  const storage = multer.diskStorage({
    destination: `./biometrics/${user.username}/`,
    filename: (req,res,next)=>{
      cb(null, Date.now() + file.extname(file.originalname));
    }
  });
  
  const upload = multer({
    storage : storage
  }).single('myVoice');
  
  upload(req,res,(err)=>{
    if(err){
      throw err;
    }
    else{
      console.log(req.file);
      req.img = `/biometrics/${user.username}/${req.file.filename}`
    }
  });
}
module.exports = router;
