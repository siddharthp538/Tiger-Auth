const express = require('express');
const fs = require('fs');
const router = express.Router();
const User = require('../../models/user');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const db = mongoose.connection;

router.post('/submit', async (req,res)=>{
  try{
    let user = new User();
    user.username = req.body.username;
    user.name = req.body.name ; 
    user.phone = req.body.phone;
    user.dob = req.body.dob;
    const dir = `../../biometrics/${user.username}/`;
    fs.mkdirSync(dir);   
    user = await face_store(user , req.body.img);
    user = await voice_store(user, req.body.audio);
    await user.save();
    res.send('Done!');
  
  }
  catch (err){
    res.status(400).send({
      message: err.message 
    });
  }
});

function face_store(user, data){
  var temp_data = data.replace(/^data:image\/png;base64,/, "");
  let buff = new Buffer(temp_data, 'base64');  
  const extension = ".png";
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
      console.log('Audio not stored!');
      throw Error('Audio could not be stored!');
    }
    else{
      console.log('Audio is getting stored!');
      return user;
    }
  });
}

module.exports = router;