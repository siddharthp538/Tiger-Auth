const express = require('express');
const fs = require('fs');
const router = express.Router();
const User1 = require('../../models/user1');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const { hashElement } = require('folder-hash');
const way2sms = require('way2sms');
const ps = require('python-shell');
const jwt = require('jsonwebtoken');

let cnt = 1;
router.get('/hash' , async(req,res) => {
  const hash = await computeAndStoreHash('siddharthp538');
  res.json({
    hash: hash
  })
});

router.post('/getToken', async (req,res) => {
  console.log(req.body.user)
  jwt.sign({user : req.body}, 'TigerAuth', (err, token) => {
    if(err) {
      res.status(403).send({
        message: err.message
      })
    } else {
      console.log(token)
      res.json({
        token
      })
    }
  });
})

const getToken = async (user) => {
  
}
router.post('/submit', async (req, res) => {
  try {
    let user1 = new User1();
    user1.username = req.body.user.username;
    user1.name = req.body.user.name;
    user1.phone = req.body.user.phone;
    user1.dob = req.body.user.dob;
    //console.log("============================1")
    //console.log(user1);
    let dir1 = path.join(__dirname, `../../biometrics/${user1.username}/`);
    await fs.mkdirSync(dir1, { recursive: true }, (err) => {
      console.log('error');
    });
    //console.log("==================2")
    imgpath = await face_store(user1, req.body.img);
    //console.log("===================3" + imgpath)
    user1.img = imgpath;
    //console.log(user1);
    let temp  = await voice_store(req.body.user);
    temp.img = user1.img;
    //console.log("------******-----" + temp)
    //console.log("==================4");
    //console.log("===========5")
    temp = new User1(temp)
    //console.log(temp.username);
    let data = '';
    const pt = path.join(__dirname, `../../biometrics/${temp.username}/voice/`);
    for(var i=1;i<=5;i++){
      const myData = 'voice_' + (i) + '_' + temp.username + '.wav';
      data = data + pt + myData + '\n'
    }
    await fs.writeFileSync(pt+'/path.txt', data);
    console.log( typeof User1 === typeof temp) 
    await temp.save();
    const dir = path.join(__dirname, `../../biometrics/${temp.username}/voice/`);
    const pathTopath = dir + 'path.txt';
    const pathToPython = path.join(__dirname, '../../python/modeltraining.py');
    console.log(pathToPython + '\n' + pathTopath + '\n' + dir);
    let options = {
      args : [
        pathTopath,
        dir
  
      ]

    }
    await ps.PythonShell.run(pathToPython, options , async (err, voicedata) => {
      if(err){
        console.log(err);
      }
      console.log(voicedata);
      console.log('I am inside the python shell!');
    });
    await computeAndStoreHash(req.body.user.username);
    res.send({
      message: 'SAVED'
    });

  }
  catch (err) {
    res.status(400).send({
      message: err.message
    });
  }
});

function face_store(user, data) {
  var temp_data = data.replace(/^data:image\/png;base64,/, "");
  let buff = new Buffer(temp_data, 'base64');
  const extension = ".png";
  const img_name = 'face_' + user.username + extension;
  user.img = path.join(__dirname, `../../biometrics/${user.username}/`) + img_name;
  fs.writeFileSync(user.img, buff);
  return user.img;
}



async function voice_store(user, username) {
  try {
    console.log('function called!');
    let mkd = path.join(__dirname, `../../biometrics/${user.username}/voice/`);
    await fs.mkdirSync(mkd, { recursive: true }, (err) => {
      console.log(err);
    });
    let vname = 'voice_1_' + user.username + ".wav";
    var temp_data = user.audio.audio1.replace(/^data:audio\/wav;base64,/, "");
    let buff = new Buffer(temp_data, 'base64');
    user.audio.audio1 = path.join(__dirname, `../../biometrics/${user.username}/voice/`) + vname;
    await fs.writeFileSync(user.audio.audio1, buff);
    
    vname = 'voice_2_' + user.username + ".wav";
    temp_data = user.audio.audio2.replace(/^data:audio\/wav;base64,/, "");
    buff = new Buffer(temp_data, 'base64');
    user.audio.audio2 = path.join(__dirname, `../../biometrics/${user.username}/voice/`) + vname;
    await fs.writeFileSync(user.audio.audio2, buff);
    
    vname = 'voice_3_' + user.username + ".wav";
    temp_data = user.audio.audio3.replace(/^data:audio\/wav;base64,/, "");
    buff = new Buffer(temp_data, 'base64');
    user.audio.audio3 = path.join(__dirname, `../../biometrics/${user.username}/voice/`) + vname;
    await fs.writeFileSync(user.audio.audio3, buff);
    
    vname = 'voice_4_' + user.username + ".wav";
    temp_data = user.audio.audio4.replace(/^data:audio\/wav;base64,/, "");
    buff = new Buffer(temp_data, 'base64');
    user.audio.audio4 = path.join(__dirname, `../../biometrics/${user.username}/voice/`) + vname;
    await fs.writeFileSync(user.audio.audio4, buff);
    
    vname = 'voice_5_' + user.username + ".wav";
    temp_data = user.audio.audio5.replace(/^data:audio\/wav;base64,/, "");
    buff = new Buffer(temp_data, 'base64');
    user.audio.audio5 = path.join(__dirname, `../../biometrics/${user.username}/voice/`) + vname;
    await fs.writeFileSync(user.audio.audio5, buff);
    console.log("***********" + JSON.stringify(user))
    return user;
  }
  catch (err) {
    throw err;
  }
}

router.post('/verifyUsername', async (req, res) => {
  if (await User1.findOne({ username: req.body.username })) {
    return res.status(400).send({
      message: 'Please enter a Unique user name!'
    });
  } else {
    return res.status(200).send({
      message: "VALID"
    });
  }
});

router.post('/verifyOTP', async (req, res) => {

  cookie = await way2sms.login('8779059156', 'Sagarika@123'); // reLogin

  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log(otp)
  try {
    await way2sms.send(cookie,req.body.phone,`Your One time Password is ${Math.floor(100000 + Math.random() * 900000)}`);
  } catch (error) {
    console.log(error);
    console.log(JSON.stringify(error))
    return res.status(400).send({
      message: 'Error in Sending OTP to the following number',
    });
  } 
  return res.status(200).send({
    message : otp
  });

});

computeAndStoreHash = (username) => {

  let dir = path.join(__dirname, `../../biometrics/${username}`);
  const options = {
    folders: { include: dir },
    matchBaseName: true
  };

  console.log('Creating a hash over the current folder:');
  return hashElement(dir, options)
    .then(hash => {
      console.log(hash.toString());
      return hash;
    })
    .catch(error => {
      return console.error('hashing failed:', error);
    });

}


module.exports = router;
