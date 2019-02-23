const express = require('express');
const fs = require('fs');
const router = express.Router();
const User = require('../../models/user');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const db = mongoose.connection;

router.post('/getForm', (req,res)=>{
  try{
    let user = new User();
    user.username = req.body.username;
    user.name = req.body.name ; 
    user.phone = req.body.phone;
    user.dob = req.body.dob;
    // verify user ka username //varsha's work
    const dir = `../../biometrics/${user.username}/`;
    fs.mkdirSync(dir);
    const face_data = ''; // data which i am going to receive from front end!
    user = face_store(user, face_data);
    user = voice_store(user, voice_data);
    // after successful user registration, create his folder 
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }   
    user.save((err)=>{
      if(err){
        throw Error('Something Went Wrong! Please try registring again!');
      }
    })
 }
  catch(err){
    console.log(err);
  }
});

router.post('/submit', (req,res)=>{
  try{
    face_store(user , )

  }
  catch{

  }
});

function face_store(user, data){
  let buff = new Buffer(data, 'base64');  
  var extension = undefined;
  var lowerCase = decoded.toLowerCase();
  if (lowerCase.indexOf("png") !== -1) extension = "png"
  else if (lowerCase.indexOf("jpg") !== -1 || lowerCase.indexOf("jpeg") !== -1)
      extension = "jpg"
  else extension = "tiff"; 
  const img_name =  'face_'+user.username + extension;
  user.img ='/home/siddharthp538/Tiger-Auth/biometrics/' +  img_name;
  fs.writeFileSync('/home/siddharthp538/Tiger-Auth/biometrics/' + name, buff);
  return user;
}
function voice_store(user){
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
