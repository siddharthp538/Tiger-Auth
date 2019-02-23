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
 
 }
  catch(err){
    console.log(err);
  }
});

router.post('/submit', (req,res)=>{
  try{
    user = face_store(user , req.body.img);
    user = voice_store(user, req.body.audio);
    
  }
  catch{

  }
});

function face_store(user, data){
  let buff = new Buffer(data, 'base64');  
  var extension = undefined;
  var lowerCase = decoded.toLowerCase();
  if (lowerCase.indexOf("png") !== -1) extension = ".png"
  else if (lowerCase.indexOf("jpg") !== -1 || lowerCase.indexOf("jpeg") !== -1)
      extension = ".jpg"
  else extension = ".tiff"; 
  const img_name =  'face_'+user.username +  extension;
  user.img =`/home/siddharthp538/Tiger-Auth/biometrics/${user.username}/` +  img_name;
  fs.writeFileSync(user.img, buff);
  return user;
}
function voice_store(user, voice){
  const voice_name =  'voice_'+user.username +  ".wav";
  
  user.audio =`/home/siddharthp538/Tiger-Auth/biometrics/${user.username}/` +  voice_name;
  fs.writeFileSync(user.audio, voice, (err, voice)=>{
    if(err){
      console.log('Error Occurred');
      throw Error('Some Error Occurred!');
    }
    else{
      console.log('Audio is getting stored!');
      return user;
    }
  });
}

module.exports = router;
