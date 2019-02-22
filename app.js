const express = require('express');
const app=express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://sihtigerauth:sihtigerauth2019@ds34765.mlab.com:47665/sihtigerauth' , {useNewUrlParser:true});
mongoose.connection.once('open', ()=>{
  console.log('Database Connected..');
});
var db = mongoose.connection;
app.get('/', (req,res)=>{
  res.send({'Hello':'Hi'});
});

const register = require('./routes/register');
app.use('/register',register);


app.listen(3000, ()=>{
  console.log('Server running on 3000....');
});
