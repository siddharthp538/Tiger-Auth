const express = require('express');
const app=express();
const mongoose = require('mongoose');
const multer = require('multer');

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
app.use('/register',register);


app.listen(3000, ()=>{
  console.log('Server running on 3000....');
});
