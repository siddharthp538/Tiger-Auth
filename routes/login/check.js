const express = require('express');
const path = require('path');
const router = express.Router();
const User = require('../../models/user');
const fs = require('fs');
var ps = require('python-shell');

router.post('/username', async (req, res) => {
  console.log(req.body);
  if (await User.findOne({ username: req.body.username })) {
    console.log('i am here!');
    res.send('Valid');
  } else {
    console.log('wrong username!');
    return res.status(200).send({
      message: 'Wrong Username! Are you a registered user?'
    });
  }
});
router.post('/videoAndBlinks', async (req, res) => {
  // const username = req.body.username;
  // const blinks = req.body.blinks;
  // const img_stored = path.join(__dirname, `../../biometrics/${username}/face_${username}.png`);
  // let video = await req.body.video.replace(/^data:video\/webm;base64,/, "");
  // let buff = await new Buffer(video, 'base64');
  const dir1 = path.join(__dirname, '../../python/detect_blink_sih.py');
  const dir = path.join(__dirname, '../../2019-02-20-130516.mp4');
  //await fs.writeFileSync(dir, buff);
  console.log(dir);
  console.log(dir1);
  let confidence = 0;
  const options = {
    args:
    [
      dir
    ]
  };
  await ps.PythonShell.run(dir1, options, function (err, data) {
    if (err) res.send(err);
    //let ans = data.toString();
    //let temp = JSON.parse("[" + ans +  "]");
    console.log(typeof(data));
     res.send(data[0]);
  });

  // const spawn = await require("child_process").spawn;
  // const process = await spawn('python', ["/home/siddharthp538/Tiger-Auth/python/detect_blink_sih.py"]);
  // process.stdout.on('data', (data) => {
  //   console.log('inside');
  //   //fs.unlinkSync(dir);
  //   res.send(data.toString());
  // });
});

router.post('/voice', async (req, res) => {
  console.log('reached voice api!');
  const username = req.body.username;
  const img_stored = path.join(__dirname, `../../biometrics/${username}/voice_${username}.wav`);
  let audio = req.body.audio.replace(/^data:audio\/wav;base64,/, "");
  let buff = new Buffer(audio, 'base64');
  // check if two faces are same! 
  console.log(img_stored);
  let confidence = 0;
  const spawn = require("child_process").spawn;
  const process = spawn('python', ["./run.py", 2, 4]);
  process.stdout.on('data', (data) => {
    console.log('python running!');
    res.send(data);
  });
  console.log('end');
});

module.exports = router;