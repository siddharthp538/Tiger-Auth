const express = require('express');
const app=express();
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser =  require('body-parser');
const messagebird = require('messagebird');
const path = require('path');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
  res.send({'Hello':'Hi'});
});

const register = require('./routes/register/register');
const check = require('./routes/login/check');
app.use('/register',register);
app.use('/check',check);

app.post('/audio', (req,res)=>{
  const data = req.body;
  console.log(data);
  fs.writeFileSync('./biometrics/mihir2.wav', data, (err, data)=>{
    if(err){
      console.log('Audio not stored!');
      throw Error('Audio could not be stored!');
    }
    else{
      console.log('Audio is getting stored!');
    }
  });
  res.send('Done!');
});

app.listen(3000, ()=>{
  console.log('Server running on 3000....');
});
