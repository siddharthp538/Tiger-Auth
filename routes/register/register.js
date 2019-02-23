const express = require('express');
const fs = require('fs');
const router = express.Router();
const User = require('../../models/user');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const db = mongoose.connection;

const way2sms = require('way2sms');

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


router.post('/verifyUsername' , async(req,res) => {
  console.log(req.body.username)
  if(await User.findOne({username : req.username})) {
    return  res.status(400).send({
        message: 'Please enter a Unique username!'
   });
  } else {
    return res.status(200).send({
      message: 'okay'
    })
  }
});

router.post('/verifyOTP' , async(req,res) => {
  
// way2sms.reLogin(<mobileno>, <password>): returns login cookie (promise)
// way2sms.smstoss(<cookie>, <tomobile>, <message>): sends sms (promise)
 console.log(req.body)
cookie = await way2sms.login('9773160417', 'Sagarika@123'); // reLogin
// <cookie string>
 
const mihir = '8451885129';
const lavina = '9820990200'; 
const gayatri = '8689931697';
const siddharth= '8850949073';
const shruti = '7718826362';
const varsha = '9773160417';
const otp  =  Math.floor(100000 + Math.random() * 900000);
console.log(otp + req.body.number)
try {
await way2sms.send(cookie,req.body.number,`Your One time Password is ${Math.floor(100000 + Math.random() * 900000)}`);
//await way2sms.send(cookie, lavina , 'Hey this is tiger auth messaging you!! All the best for SIH .You guys rock!! -To team and team leader Mihir');
//await way2sms.send(cookie, gayatri, 'Hey this is tiger auth messaging you!! All the best for SIH .You guys rock!! -To team and team leader Mihir');
//await way2sms.send(cookie, siddharth, 'Hey this is tiger auth messaging you!! All the best for SIH .You guys rock!! -To team and team leader Mihir');
//await way2sms.send(cookie, shruti, 'Hey this is tiger auth messaging you!! All the best for SIH .You guys rock!! -To team and team leader Mihir');
//await way2sms.send(cookie, varsha, 'Hey this is tiger auth messaging you!! All the best for SIH .You guys rock!! -To team and team leader Mihir');
} catch (error) {
  console.log(error);
  console.log(JSON.stringify(error))
  return res.status(400).send({
    message: 'Error in Sending OTP to the following number',
  });
} 
return res.status(200).send({
  otp
});

})

module.exports = router;
