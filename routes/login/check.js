const express = require('express');
const path = require('path');
const router = express.Router();
const User = require('../../models/user');

router.post('/username', async (req,res)=>{
    if(await User.findOne({username : req.username})) {
        res.redirect('/face');
      } else {
        return res.status(400).send({
          message: 'Wrong Username! Are you a registered user?'
        });
      }
});
router.post('/face',async (req,res)=>{
  console.log('reached face api!');
  const username = req.body.username;
  console.log(username);
  const img_stored  = path.join(__dirname, `../../biometrics/${username}/face_${username}.png`);
  const img_received = req.body.img;
  // check if two faces are same! 
  console.log(img_stored);
  let confidence = 0;
  const spawn = require("child_process").spawn;
  const process = spawn('python', ["./run.py",2,4]);
  process.stdout.on('data', (data) => {
    console.log('python running!');
    res.send(data.toString());
  });
  console.log('end');
});

module.exports = router;