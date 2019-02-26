const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../models/user');


function verifyToken(req, res, next) {
    console.log(req.headers);
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

router.post('/' , verifyToken , async (req,res) => {
  try {
    if(!req.token){
      res.status(403).send({
        message: "AccessToken Required" 
      })
    }
      jwt.verify(req.token,'TigerAuthAccessToken', async(err,authData)=> {
        
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
          res.status(200).send({
            response
          })
        }
      })
    } catch (err) {
      res.status(400).send({
        err
      })
    }
})
module.exports = router;