const express = require('express');
const app=express();
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser =  require('body-parser');
const messagebird = require('messagebird');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use (express.static(path.join(__dirname,'biometrics')));
const mongoURI = 'mongodb://sihtigerauth:sihtigerauth2019@ds347665.mlab.com:47665/sihtigerauth'
mongoose.connect(mongoURI,{
  useNewUrlParser: true 
})
.then(() => {
   console.log('MongoDB connected..');
})
.catch(err => {
   console.log(err);
});


var db = mongoose.connection;
app.get('/', (req,res)=>{
  res.send('Welcome to TigerAuth!');
});

const register = require('./routes/register/register');
const check = require('./routes/login/check');
const clientRegister = require('./routes/login/clientRegister');

app.use('/register',register);
app.use('/check',check);
app.use('/clientRegister', clientRegister);

app.post('/audio', (req,res)=>{   
  var temp_data = req.body.audio.replace(/^data:audio\/wav;base64,/, "");
  let buff = new Buffer(temp_data, 'base64');  
  fs.writeFileSync('./mihir.wav', buff);
  res.send('Done!');
});

app.post('/video', (req,res)=>{
  var temp_data = req.body.video.replace(/^data:video\/webm;base64,/, "");
  let buff = new Buffer(temp_data, 'base64');
  fs.writeFileSync('./lavina.webm', buff);
  res.send('Done!');
});

app.listen(3000, ()=>{
  console.log('Server running on 3000....');
});
