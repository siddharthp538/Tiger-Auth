const express = require('express');
const router = express.Router();
const Client = require('../../models/client');
const hashAndSalt = require('password-hash-and-salt');
const jwt = require('jsonwebtoken');
const http = require('http');
const url = require('url');
const fs = require('fs');
var lzString = require("lz-string")

router.post('/',async  (req,res)=>{

    const newClient =  new Client ({
        domainName: req.body.domainName,
        callbackUrl: req.body.callbackUrl,
        face: req.body.face,
        otp: req.body.otp,
        voice: req.body.voice,
        permissions: {
            name: req.body.permissions.name,
            username: req.body.permissions.username,
            phone: req.body.permissions.phone,
            dob: req.body.permissions.dob,
            img: req.body.permissions.img,
            audio: req.body.permissions.audio
        },
    })
    hashAndSalt(newClient.domainName).hash(function(error, hash){
        if(error) {
            return  res.status(500).send({
                message: 'Internal Server error .Not able to store hash'
        });
    }
        newClient.secretKey = hash;
        //console.log(newClient.secretKey + "---1");
        let left = Math.floor(Math.random()*2) ;
        let right = Math.floor(Math.random()*10 ) + 2;
        let inr = Math.floor(Math.random() *20) + 5;
        //console.log((left +inr) + " "+ (right+inr));
        //console.log(newClient.secretKey + '---2')
        newClient.secretKey = String(newClient.secretKey).substring( left+inr ,  right+inr );
        //console.log(newClient.secretKey + '---3')
        const detailClient = {
            domainName: req.body.domainName,
            callbackUrl: req.body.callbackUrl,
            face: req.body.face,
            otp: req.body.otp,
            voice: req.body.voice,
            permissions: {
                name: req.body.permissions.name,
                username: req.body.permissions.username,
                phone: req.body.permissions.phone,
                dob: req.body.permissions.dob,
                img: req.body.permissions.img,
                audio: req.body.permissions.audio
            },
        }

        jwt.sign({client: detailClient },newClient.secretKey, async (err,token) => {
            if(err) {
                return res.status(500).send({
                    message: 'Internal Server error.Not able to get secret for the client'
                });
            }
            //console.log('token =' + token);
            await newClient.save();
            console.log(token)
            res.setHeader('Content-disposition', 'attachment; filename=theDocument.txt');
            res.setHeader('Content-type', 'text/plain');
            res.end(token);
          
            // return res.status(200).send({
            //     secret:token,
            //     key: newClient.secretKey
                
            // })
            
        });
    });
    
    

})


//To verify apis
router.post('/check', verifyToken, (req, res) => {  
    jwt.verify(req.token, req.body.key, (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        res.json({
          authData
        });
      }
    });
  });

  function verifyToken(req, res, next) {
    // Get auth header value
    console.log(req.headers);
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  
  }

module.exports = router;