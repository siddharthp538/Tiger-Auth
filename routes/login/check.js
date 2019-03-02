const express = require('express');
const path = require('path');
const router = express.Router();
const User1 = require('../../models/user1');
const fs = require('fs');
var ps = require('python-shell');
const request = require('request');
const ffmpeg = require('fluent-ffmpeg');
const way2sms = require('way2sms');


let facepath1;
let facepath2;

router.post('/username', async (req, res) => {
  console.log(req.body);
  if (await User1.findOne({ username: req.body.username })) {
    console.log('i am here!');
    res.status(200).send({
      message : "valid"
    });
  } else {
    console.log('wrong username!');
    return res.status(200).send({
      message: 'Wrong Username! Are you a registered user?'
    }); 
  }
});

router.post('/videoAndBlinks', async (req, res) => {
  const username = req.body.username;
  const blinks = req.body.blinks;
  const img_stored = path.join(__dirname, `../../biometrics/${username}/face_${username}.png`);
  let video = await req.body.video.replace(/^data:video\/webm;base64,/, "");
  let buff = await new Buffer(video, 'base64');
  const dir1 = path.join(__dirname, '../../python/detect_blink_sih.py');
  const dir = path.join(__dirname, '../../a.mp4');
  await fs.writeFileSync(dir, buff);
  console.log(dir);
  console.log(dir1);
  let confidence = 0; 
  const options = {
    args:
      [
        dir
      ]
  };
  await ps.PythonShell.run(dir1, options, async function (err, data) {
    if (err) res.send(err);
    fs.unlinkSync(dir);
    const img_received = path.join(__dirname, '../../a.png');
    console.log(img_received);
    facepath1 = img_received;
    facepath2 = img_stored;
    console.log(img_stored);
    console.log('no of blinks: ' + data[0]);
    console.log('req blinks: ' + req.body.blinks);
    if (data[0] == req.body.blinks) {
      const p = path.join(__dirname, '../../python/face_recognise.py');
      const o = {
        args:
          [
            img_received,
            img_stored
          ]
      };
      await ps.PythonShell.run(p, o, (err, data) => {
        if (err) res.send(err);
        console.log(data.toString());
        res.send({
          message: 'valid'
        });

      });
    }
    else {
      res.send("FALSE");
    }
  });
});

router.post('/voice', async (req, res) => {
    const pathToS2T = path.join(__dirname, '../../python/speech2text.py');
    const pathToPython = path.join(__dirname, '../../python/test.py');
    const arg1 = path.join(__dirname, `../../biometrics/${req.body.username}/voice/`);
    var temp_data = req.body.audio.replace(/^data:audio\/wav;base64,/, "");
    let buff = new Buffer(temp_data, 'base64');  
    const dir = path.join(__dirname, '../../a.wav');

    console.log(dir);
    await fs.writeFileSync(dir, buff);
    let opt = {
      args : [
        dir 
      ]
    }
    await ps.PythonShell.run(pathToS2T, opt, async (err, data) => {
      console.log('s2t says: ' + data.toString());
      return; 
      const arg2 = path.join(__dirname,`../../biometrics/${req.body.username}/voice/voice.gmm`);
      const options = {
        args : [
          dir,
          arg2
        ]
      }
      await ps.PythonShell.run(pathToPython, options, (err, ans) => {
        if(err) res.send(err);
        else res.send({
          message: 'valid'
        });
      });
    })

});

router.post('/verifyOTP', async (req, res) => {
  try{
    console.log('i am in verifyOTP');
    console.log(req.body)
    const user = req.body.username;
    cookie = await way2sms.login('8779059156', 'Sagarika@123'); // reLogin
    const dbResponse = await User1.findOne({ username: user});
    console.log(dbResponse);
    if(!dbResponse) {
      console.log('error: user not found');
      res.status(400).send({
        message: 'user not found'
      });
    } 
    console.log('collection found out');
    const num = dbResponse.phone;
    console.log('phone: ' + num);
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);
    await way2sms.send(cookie,num,`Your One time Password is ${Math.floor(100000 + Math.random() * 900000)}`);   
    return res.status(200).send({
      message:otp
    });
  }
  catch(err){
    throw err;
  }
 
});


module.exports = {
  router,
  facepath1,
  facepath2
};