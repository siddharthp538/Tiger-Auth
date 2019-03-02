const express = require('express');
const app=express();
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser =  require('body-parser');
const messagebird = require('messagebird');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const unirest = require('unirest')
const way2sms = require('way2sms');
app.use(cookieParser());

const ffmpeg = require('fluent-ffmpeg');
const Activity = require('./models/activity');
const https = require('https');

let options = {
  key : fs.readFileSync('./server.key'),
  cert : fs.readFileSync('./server.crt')
}

app.use(cors());
app.use(bodyParser.json({ limit: '100mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use (express.static(path.join(__dirname,'biometrics')));
const mongoURI = 'mongodb://sihtigerauth:sihtigerauth2019@ds347665.mlab.com:47665/sihtigerauth'
//const mongoURI = 'mongodb://localhost/sihtigerauth'
mongoose.connect(mongoURI,{
  useNewUrlParser: true 
})
.then(() => {
   console.log('MongoDB connected..');
})
.catch(err => {
   console.log(err);
});

app.get('/', async (req,res)=>{
  const bodyToSend = {
    apikey: 'DZ5614KZ864GAY8EYARRMSNG3UMCHYVB',
    secret: '0N05X4PUQ9WNSTWI',
    usetype: 'stage',
    phone: '8779059156',
    message: 'hello',
    senderid: 'varsha'
  }
  unirest.post(`http://www.way2sms.com/api/v1/sendCampaign`).send(bodyToSend).strictSSL(false).end(async (response) =>{
   console.log(bodyToSend)
 })
 res.send('hello')
});

const register = require('./routes/register/register');
const check = require('./routes/login/check').router;
const clientRegister = require('./routes/login/clientRegister');
const loginUsers = require('./routes/login/loginUsers');
const login = require('./routes/login/login');
const resource = require('./routes/login/resource');
const logout = require('./routes/logout/logout');


app.use('/register',register);
app.use('/check',check);
app.use('/clientRegister', clientRegister);
app.use('/loginUsers',loginUsers);
app.use('/login',login);
app.use('/login/resource', resource);
app.use('/logout',logout);

app.post('/audio', (req,res)=>{   
  var temp_data = req.body.audio.replace(/^data:audio\/wav;base64,/, "");
  let buff = new Buffer(temp_data, 'base64');  
  fs.writeFileSync('./mihir.wav', buff);
  res.send('Done!');
});

app.post('/video', (req,res)=>{ 
  console.log(req.body);
  var temp_data = req.body.video.replace(/^data:video\/webm;base64,/, "");
  const blinks_done = req.body.blinks;
  let buff = new Buffer(temp_data, 'base64');
  fs.writeFileSync('./check.mp4', buff);
  res.send('Done!');
});

app.post('/user/activity',async (req,res) => {
  try { 
  const username = req.body.username;
  const ans = await  Activity.findOne({username: req.body.username})
  console.log(ans);
  res.send(ans);
  } catch(err) {
    res.status(400).send({
      message: err
    });
  }
  
});


https.createServer(options, app).listen(3000, ()=>{
  console.log('Server running on 3000....');
});