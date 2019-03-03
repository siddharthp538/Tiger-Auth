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
const unirest = require('unirest');
const sessionstorage = require('sessionstorage');
const request = require('request');

let cnt = 1;
router.get('/hash', async (req, res) => {
  const hash = await computeAndStoreHash('siddharthp538');
  res.json({
    hash: hash
  })
});

router.post('/getToken', async (req, res) => {
  console.log(req.body.user)
<<<<<<< HEAD
  jwt.sign({ user: req.body }, 'TigerAuth', (err, token) => {
    if (err) {
=======
 await jwt.sign({user : req.body}, 'TigerAuth', (err, token) => {
    if(err) {
>>>>>>> a3d3c4b25ecf0fd6e83ebca762788fda25fbc69f
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
const addToken = async (user, cookieArray , key ,username) =>{
  await  jwt.sign({ user} , 'TigerAuth', (err,token) => {
    if(err) {
      res.status(400).send({
        message: 'token not created',
        TigerAuth: TigerAuth
      }) 
    } else {
      console.log(token)
      let found = false;
      for (var itr = 0 ; itr< cookieArray.length ; itr ++){
        var userObject = cookieArray [itr];
        if (userObject.username === username) {
          console.log(userObject)
          found = true;
          if(key === 'faceToken')
          userObject.faceToken= token;
          else if (key === 'voiceToken')
          userObject.voiceToken = token;
          else if(key === 'otpToken')
            userObject.otpToken = token;
        }
        cookieArray[itr] = userObject;
        console.log('------' + JSON.stringify(cookieArray[itr]))
      }
    }
  })
}
router.post('/submit', async (req, res) => {
  try {
    let user1 = new User1();
    user1.username = req.body.user.username;
    user1.name = req.body.user.name;
    user1.phone = req.body.user.phone;
    user1.dob = req.body.user.dob;
    const TigerAuth = req.body.TigerAuth;
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
    let temp = await voice_store(req.body.user);
    temp.img = user1.img;
    //console.log("------******-----" + temp)
    //console.log("==================4");
    //console.log("===========5")
    temp = new User1(temp)
    //console.log(temp.username);
    let data = '';
    const pt = path.join(__dirname, `../../biometrics/${temp.username}/voice/`);
    for (var i = 1; i <= 5; i++) {
      const myData = 'voice_' + (i) + '_' + temp.username + '.wav';
      data = data + pt + myData + '\n'
    }
    await fs.writeFileSync(pt + '/path.txt', data);
    console.log(typeof User1 === typeof temp)
    await temp.save();
    const dir = path.join(__dirname, `../../biometrics/${temp.username}/voice/`);
    const pathTopath = dir + 'path.txt';
    const pathToPython = path.join(__dirname, '../../python/modeltraining.py');
    console.log(pathToPython + '\n' + pathTopath + '\n' + dir);

    let options = {
      args: [
        pathTopath,
        dir

      ]

    }
    await ps.PythonShell.run(pathToPython, options, async (err, voicedata) => {
      if (err) {
        console.log(err);
      }
      console.log(voicedata);
      console.log('I am inside the python shell!');
    });
<<<<<<< HEAD
    const obj = await computeAndStoreHash(req.body.user.username);
    console.log(obj);
    const final_obj = {
      $class: "org.user.data.User",
      username: temp.username,
      name: temp.name,
      phoneNumber: temp.phone,
      dateOfBirth: temp.dob,
      biometricHash: obj.hash,
      imageHash: obj.children[0].hash,
      audioHash: obj.children[1].hash
    }
    console.log(final_obj);
    let ans = 0;
    await request.post({
      url: 'http://172.30.9.156:3000/api/org.user.data.User',
      body: final_obj,
      headers: { 'content-type': 'application/json' },
      json: true

    }, (req, res) => {
      console.log('Successfully saved in blockchain');
    });
    res.send({
      message: 'saved'
    });
    
    console.log('Welcome to TigerAuth, my friend!');
  
=======
    const username = req.body.user.username;
    const cookieArray = TigerAuth;
    cookieArray.push({
      username,
      faceToken: '',
      voiceToken: '',
      otpToken: ''
    })
    
    //await computeAndStoreHash(req.body.user.username);
    const hashResponse = await computeAndStoreHash(req.body.user.username);
    //face token
    let user = {
      username: username,
      hash:  hashResponse.children[0].hash ,
      face: `${username}/face_${username}.png`
    }
    jwt.sign({ user } , 'TigerAuth' , (err,token) => {
      if(err) {
        throw err;
      } else {
        cookieArray[cookieArray.length-1].faceToken = token;
         user = {
          username,
          hash: hashResponse.children[1].hash,
          voice: `${username}/voice/voice_1_${username}.wav`
        }
        jwt.sign({user} , 'TigerAuth' , (err,token) => {
          if(err) {
            throw err;
          } else {
            cookieArray[cookieArray.length -1].voiceToken = token;
            user = {
              username,
              hash: hashResponse.hash,
              otp:  `${username}/otp_${username}.txt`
            }
            jwt.sign({user}, 'TigerAuth' , (err,token) => {
              if(err){
                throw err;
              } else {
                cookieArray[cookieArray.length-1].otpToken = token;
                res.status(200).send({
                  message: 'valid',
                  TigerAuth: cookieArray
                })
              }
            })
          }
        })
      }
    }) 
>>>>>>> a3d3c4b25ecf0fd6e83ebca762788fda25fbc69f

    
  } catch (err) {
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

router.post('/verifyOTP', async (req, res) => {

  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log(otp)
<<<<<<< HEAD
  try {

    const bodyToSend = {
      apikey: 'DZ5614KZ864GAY8EYARRMSNG3UMCHYVB',
      secret: '0N05X4PUQ9WNSTWI',
      usetype: 'stage',
      phone: req.body.phone,
      message: `Your One Time Password is ${otp}`,
      senderid: 'varsha'
    }
    unirest.post(`http://www.way2sms.com/api/v1/sendCampaign`).send(bodyToSend).strictSSL(false).end(async (response) => {
      console.log(bodyToSend)
    })
    return res.status(200).send({
      message: otp
    });

  } catch (error) {
    console.log(error.message);
    console.log(JSON.stringify(error))
    return res.status(400).send({
      message: error.message
    });
  }

=======
  // try {
   
  //   const bodyToSend = {
  //     apikey: 'DZ5614KZ864GAY8EYARRMSNG3UMCHYVB',
  //     secret: '0N05X4PUQ9WNSTWI',
  //     usetype: 'stage',
  //     phone: req.body.phone,
  //     message: `Your One Time Password is ${otp}`,
  //     senderid: 'varsha'
  //   }
  //   unirest.post(`http://www.way2sms.com/api/v1/sendCampaign`).send(bodyToSend).strictSSL(false).end(async (response) =>{
  //    console.log(bodyToSend)
  //  })
   return res.status(200).send({
    message : otp
   });
  // });

  // } catch (error) {    
  //   console.log(error.message);
  //   console.log(JSON.stringify(error))
  //   return res.status(400).send({
  //     message: error.message
  //   });
  
  
>>>>>>> a3d3c4b25ecf0fd6e83ebca762788fda25fbc69f

});
router.post('/verifyUsername', async (req, res) => {
  if (await User1.findOne({ username: req.body.username })) {
    return res.status(200).send({
      message: 'Please enter a Unique user name!'
    });
  } else {
    return res.status(200).send({
      message: "VALID"
    });
  }
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
      //console.log(hash.toString());
      return hash;
    })
    .catch(error => {
      return console.error('hashing failed:', error);
    });

}


module.exports = router;
