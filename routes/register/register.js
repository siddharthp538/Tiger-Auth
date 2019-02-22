const express = require('express');
const router = express.Router();
const User = require('../../models/user');

router.post('/getFormdata', async (req,res)=>{
  const user = new User();
  user.fname = req.body.firstName;
  user.lname = req.body.lastName;
  user.phone = req.body.phone;
  user.dob = req.body.dob;
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
module.exports = router;
