const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Client = require('../../models/client');
let TigerAuth  = [
    {
        faceToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoic2lkZGhhcnRocDUzOCIsImZhY2UiOiJiaW9tZXRyaWNzL3NpZGRoYXJ0aHA1MzgvZmFjZV9zaWRkaGFydGhwNTM4LnBuZyIsImhhc2giOiJvbjFlT1BVZlRKdWdXcUxaS0tmTzBia0wvYm89In0sImlhdCI6MTU1MTA4NzM0NX0.4NW_O276KSMgLgu3uPt00btS8zy0TTMRcHTPpY6ADaA",
	 
	 
        voiceToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoic2lkZGhhcnRocDUzOCIsImZhY2UiOiJiaW9tZXRyaWNzL3NpZGRoYXJ0aHA1MzgvZmFjZV9zaWRkaGFydGhwNTM4LnBuZyIsImhhc2giOiJvbjFlT1BVZlRKdWdXcUxaS0tmTzBia0wvYm89In0sImlhdCI6MTU1MTA5MjkyNn0.5NmmXxYgd0LrOlcHBmLjHI34JgfI8Ph_c82vqx5BFQM",
        
        
        
        otpToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoic2lkZGhhcnRocDUzOCIsImZhY2UiOiJiaW9tZXRyaWNzL3NpZGRoYXJ0aHA1MzgvZmFjZV9zaWRkaGFydGhwNTM4LnBuZyIsImhhc2giOiJvbjFlT1BVZlRKdWdXcUxaS0tmTzBia0wvYm89In0sImlhdCI6MTU1MTA5MzEwOH0.Cmc4TxKiHb0kzzTXwEKo4YQKhe1nOt2XNaqrcSWoHlA",

        username: "siddharthp538"
    },
    {

            faceToken: "pqr",
            otpToken: "lmn",
            voiceToken: "tuv",
            username: "sagarika12"
    }
    
];
router.get('/setcookie' , (req,res) => {

    res.clearCookie('TigerAuth');
    res.cookie("TigerAuth" ,TigerAuth);
    res.send("user data added to the cookie");
});

router.get('/getcookie',(req,res) => {
    res.send(req.cookies);
})

const tokenVerification = (token)=> {
    if(!token)
        return false;
   
    return jwt.verify(token, 'TigerAuth' , (err, authData) => {
        if(err) {
            return false;
        } else {
            // write code to check data for specific token
            return true;
        }
      });
}
const getClientSecretKey = async (domainName ) => {
    const clientDetail =  await Client.findOne({ domainName});
    if ( clientDetail)
        return clientDetail;
}
const getClientTokenDetail = async(token, domainName) => {
    if (!token)
        throw Error('secretKey of Client required');
    clientDetail =  await getClientSecretKey(domainName);
    if (!clientDetail)
        throw Error('domain Name not registered with TigerAuth');
    return jwt.verify(token, clientDetail.secretKey , (err,authData) => {
        if(err) {
            throw err;
        } else {
            return authData.client;
        }
    })
}


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



router.get('/:domainName' , async (req, res) => {
    if ( req.cookies.TigerAuth)
    {
        res.redirect('https://www.google.com/');
    } else {
        res.redirect('https://www.hackerrank.com/')
    }
})

router.post('/' , verifyToken, async (req,res) => {

    const cookieArray = req.cookies.TigerAuth;
    console.log(cookieArray)
    let usersData = [];
    const clientData = await getClientTokenDetail(req.token, req.body.domainName);

    for (var itr = 0 ; itr < cookieArray.length ; itr ++)
    {
        let userObject =  cookieArray [itr];
        let dataObject= {};
        let facetoken = userObject.faceToken;
       
        dataObject.faceTokenCheck =   await tokenVerification(userObject.faceToken);
        dataObject.otpTokenCheck =  await tokenVerification(userObject.otpToken);
        dataObject.voiceTokenCheck = await tokenVerification(userObject.voiceToken);
        dataObject.username = userObject.username;
        usersData.push(dataObject)


    }
    res.send({ usersData , clientData });
    
})
module.exports = router;