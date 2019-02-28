const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../models/user');
const Cookies   = require('js-cookie');
const Client = require('../../models/client')
const AccessKey = require('../../models/accessKey');

function verifyToken(req, res, next) {

    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(403);
    }
}

router.post('/' , verifyToken, async (req,res) => {
  try {
    console.log('///////////////////////////////////////////////')
    if(!req.token){
      res.status(403).send({
        message: "clientToken Required" 
      })
    }
    console.log(req.body)
    if(!req.body.id) {
      res.status(403).send({
        message: "Id required"
      })
    }
    
    if(!req.body.domainName){
      res.status(400).send({
        message: "domainName required"
      })
    }
    console.log(req.body.domainName)
    const id = req.body.id;
    const dbResponse = await AccessKey.findOne({ _id : req.body.id });
    console.log(dbResponse)
    if(!dbResponse){
      res.status(403).send({
        message: "id not found"
      })
    }
    const clientDetail = await Client.findOne({ domainName: req.body.domainName });
    if(!clientDetail) {
      res.status(403).send({
        message: 'client not registered'
      })
    }
    const key = clientDetail.secretKey;
    jwt.verify(req.token, key , async (err,authData) => {
      if(err) {
        res.status(403).send({
          message: 'Invalid client token'
        })
      } else {
        console.log(authData)
      }
    })
  
      jwt.verify(dbResponse.accessToken,'TigerAuthAccessToken', async(err,authData)=> {
        
        if(err) {
          res.status(403).send({
            message: 'Invalid AccessToken'
          })
        } else {
          console.log(authData);
          const username  =  authData.user.username;
          const user = await User.findOne({username});
          const response = {};
          if (authData.user.permissions.face) response.img = user.img
          if (authData.user.permissions.audio) response.audio = user.audio
          if (authData.user.permissions.name) response.name = user.name
          if (authData.user.permissions.phone) response.phone = user.phone
          if (authData.user.permissions.dob) response.dob = user.dob
          if (authData.user.permissions.username) response.username = user.username
          response.callbackUrl = authData.user.callbackUrl;
          response.domainName = authData.user.domainName;
          res.json({
            response
          })
        }
      })
    } catch (err) {
      res.json({
        err
      })
    }
})


router.get('/cookie', (req,res)=>{
  Cookies.set('name', 'value', { expires: 7, path: '' });
  res.send(
    Cookies.get()
  )
});


module.exports = router;