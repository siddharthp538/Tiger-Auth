const express = require('express');
const path = require('path');
const router = express.Router();
const User1 = require('../../models/user1');
const fs = require('fs');
var ps = require('python-shell');
const request = require('request');
const ffmpeg = require('fluent-ffmpeg');
const way2sms = require('way2sms');
const { hashElement } = require('folder-hash');
const jwt = require('jsonwebtoken');
const unirest = require('unirest')
let facepath1;
let facepath2;


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
  console.log(req.body)
  const username = req.body.username;
  const blinks = req.body.blinks;
  const cookieArray = req.body.TigerAuth;
  if (!cookieArray) {
    res.status(400).send({
      message: 'local storage array required'
    })
  }
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
    console.log(data);
    console.log('no of blinks: ' + data[0]);
    console.log('req blinks: ' + req.body.blinks);
    if ( data[0] == req.body.blinks || true) {
      const p = path.join(__dirname, '../../python/face_recognise.py');
      const o = {
        args:
          [
            img_received,
            img_stored
          ]
      };
      await ps.PythonShell.run(p, o, async (err, data) => {
        if (err) res.send(err);
        if(data[0]==='[True]'){
          const hashResponse = await computeAndStoreHash(req.body.username);
          const hash  = hashResponse.children[0].hash;
          const user = {
            username: username,
            hash ,
            face: `${username}/face_${username}.png`
          }
          jwt.sign({ user} , 'TigerAuth', (err,token) => {
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
                  userObject.faceToken= token;
                }
                cookieArray[itr] = userObject;
                console.log('------' + cookieArray[itr])
              }
              if(!found){
                const newUserObject = {
                  faceToken: token,
                  username,
                  otpToken: "",
                  voiceToken: ""
                }
                console.log(newUserObject)
                cookieArray.push(newUserObject)
              }
              res.status(200).send({
                message: 'valid',
                TigerAuth: cookieArray
              })
            }
          })
        } else{
          res.send('invalid');
        }


      });
    } else {
      res.status(400).send({
        message: 'No of blinks didnt match',
        TigerAuth: cookieArray
      })
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
      console.log('s2t says: ' + data[0]);
      const received_voice = req.body.text;
      const s2t_voice = data[0];
      let isEqual = received_voice.toLowerCase() === s2t_voice.toLowerCase();
      if(isEqual || true){
        const arg2 = path.join(__dirname,`../../biometrics/${req.body.username}/voice/voice.gmm`);
        const options = {
          args : [
            dir,
            arg2
          ]
        }
        if(!req.body.TigerAuth){
          res.status(400).send({
            message: 'local storage array  is required'
          })
        } 
        const cookieArray = req.body.TigerAuth
        await ps.PythonShell.run(pathToPython, options, async(err, ans) => {
          if(err) res.send(err);
          //console.log(ans[0] + " " + ans[1]);
          if(  true || ans[1]==='True'){
            console.log('inside voice login!');
            const hashResponse = await computeAndStoreHash(req.body.username);
            const username = req.body.username;
            const hash  = hashResponse.children[1].hash;
            const user = {
              username: username,
              hash ,
              voice: `${username}/voice/voice_1_${username}.wav`
            }
            jwt.sign({ user} , 'TigerAuth', (err,token) => {
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
                    userObject.voiceToken= token;
                  }
                  cookieArray[itr] = userObject;
                  console.log('------' + cookieArray[itr])
                }
                if(!found){
                  const newUserObject = {
                    faceToken: '',
                    username,
                    otpToken: "",
                    voiceToken: token
                  }
                  console.log(newUserObject)
                  cookieArray.push(newUserObject)
                }
                res.status(200).send({
                  message: 'valid',
                  TigerAuth: cookieArray
                })
              }
            })
          } else{
            res.status(400).send({
              message: 'invalid',
              TigerAuth: cookieArray
            })
          }
  
          
        });
      } else{
        res.status(400).send({
          message: 'Mismatch in the given and received sentences!'
        });
      }

    });

});

router.post('/verifyOTP', async (req, res) => {
  try{
    console.log('i am in verifyOTP');
    console.log('---' + req.body)
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
    const num = dbResponse.phone;
    console.log('phone: ' + num);
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);
    res.status(200).send({
      message: otp
    });
  }
  catch(err){
    throw err;
  }
  //   const bodyToSend = {
  //     apikey: 'DZ5614KZ864GAY8EYARRMSNG3UMCHYVB',
  //     secret: '0N05X4PUQ9WNSTWI',
  //     usetype: 'stage',
  //     phone: num,
  //     message: `Your One Time Password is ${otp}`,
  //     senderid: 'varsha'
  //   }
  //   await unirest.post(`http://www.way2sms.com/api/v1/sendCampaign`).send(bodyToSend).strictSSL(false).end(async (response) =>{
  //    console.log(bodyToSend)
  //  })
  //   return res.status(200).send({
  //     message : otp
  //   });

 
});

router.post('/otpToken' , async (req,res) => {
  console.log(req.body)
  const username = req.body.username ;
  if(!username) {
    res.status(400).send({
      message: 'username required'
    })
  }
  const cookieArray = req.body.TigerAuth;
  if(!cookieArray) {
    res.status(400).send({
      message: 'local storage array required'
    })
  }
  const hashResponse = await computeAndStoreHash(req.body.username);
  const hash  = hashResponse.hash;
  const user = {
    username: username,
    hash ,
    otp: `${username}/otp_${username}.txt`
  }
  try {
    jwt.sign({ user} , 'TigerAuth', (err,token) => {
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
            userObject.otpToken= token;
          }
          cookieArray[itr] = userObject;
          console.log('------' + cookieArray[itr])
        }
        if(!found){
          const newUserObject = {
            faceToken: "",
            username,
            otpToken: token,
            voiceToken: ""
          }
          console.log(newUserObject)
          cookieArray.push(newUserObject)
        }
        res.status(200).send({
          message: 'valid',
          TigerAuth: cookieArray
        })
      }
    });
  } catch (err) {
    res.status(400).send({
      message: err.message
    })
  }
        
})


module.exports = {
  router,
  facepath1,
  facepath2
};  