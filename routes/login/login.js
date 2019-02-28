const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Client = require('../../models/client');
const User = require('../../models/user');
const hashAndSalt = require('password-hash-and-salt');
const Key = require('../../models/key')
const AccessKey = require('../../models/accessKey');

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
const getClientSecretKey = async (domainName ) => {
    const clientDetail =  await Client.findOne({ domainName});
    console.log('here: '+ clientDetail)
    if ( clientDetail)
        return clientDetail;
}
const getClientTokenDetail = async(token, domainName) => {
    if (!token)
        throw Error('secretKey of Client required');
    let clientDetail =  await getClientSecretKey(domainName);
    if (!clientDetail)
        throw Error('domain Name not registered with TigerAuth');
    return jwt.verify(token, clientDetail.secretKey , (err,authData) => {
        if(err) {
            throw err;
        } else {
            console.log('---4' + authData.client)
            return authData.client;
        }
    })
}
const tokenVerification = (token)=> {
    console.log(token)
    if(!token)
        return false;
   
    return jwt.verify(token, 'TigerAuth' , (err, authData) => {
        if(err) {
            console.log(err)
            return false;
        } else {
            console.log(authData)
            // write code to check data for specific token
            return true;
        }
      });
}


/*
router.post('/', verifyToken , async (req,res) => {
   

    if(!req.token) {
        res.status(400).send({
            message: 'secret for client not found'
        })
    }
    if(!req.body.domainName) {
        res.status(400).send({
            message: 'domainName of client required'
        })
    }
    try {

        
        const clientData = await getClientTokenDetail(req.token, req.body.domainName);
        const cookieArray = req.cookies.TigerAuth;
        console.log(cookieArray)
        // if (!cookieArray || !cookieArray.length){
        //     res.redirect('https://www.google.com/');
        // }
        let found = false ;
        for (var itr = 0 ; itr < cookieArray.length ; itr ++)
        {
            let userObject =  cookieArray [itr];
            if (userObject.username === req.body.username) { 
                console.log('------------1');
                console.log(userObject)
               console.log('----2')
                found = true;
                let response = {};
                let havingAllRequired = true ;
                console.log('-------2')
                console.log(userObject)
                const faceTokenCheck =   await tokenVerification(userObject.faceToken);
                if (!faceTokenCheck && clientData.face){
                    response.faceRequired = true;
                    havingAllRequired = false ;
                } 
                const otpTokenCheck =  await tokenVerification(userObject.otpToken);
                if (!otpTokenCheck && clientData.otp) {
                    response.otpRequired = true;
                    havingAllRequired = false ;
                }
                const voiceTokenCheck = await tokenVerification(userObject.voiceToken);
                if (!voiceTokenCheck && clientData.voice) {
                    response.voiceRequired = true;
                    havingAllRequired = false;
                }
                console.log('------2')
                console.log(response)
                if (!havingAllRequired){
                    res.status(400).send({
                        response
                    })
                } else {

                }

            }


        }
        if(!found){
            res.redirect('https://www.google.com/');
        } else {
            // const accessToken = await getAccessToken(clientData,req.body.username,res)
            //  console.log(accessToken + "====")
            // res.status(200).send({
            //     accessToken: accessToken
            // })
            console.log('in else')
            console.log(clientData)
            let newClient = {
                domainName: clientData.domainName,
                callbackUrl: clientData.callbackUrl,
                permissions: {
                    name: clientData.permissions.name,
                    username: clientData.permissions.username,
                    phone: clientData.permissions.phone,
                    dob: clientData.permissions.dob,
                    img: clientData.permissions.img,
                    audio: clientData.permissions.audio
                },
                username: req.body.username
        
            };
            console.log('9999' + newClient)
            jwt.sign({user: newClient }, 'TigerAuthAccessToken' ,  (err,token) => {
                if(err) {
                    throw err;
                    
                } else {
                    console.log(token)
                    res.status(200).send({
                        token
                    })
                    
                }
            
            });

        }

    } catch (err) {
        res.status(400).send({
            err
        })
    }


})


*/

router.post('/', async (req,res) => {
   
    if(!req.body.id) {
        res.status(403).send({
            message: 'Id required'
        })
    }
    if(!req.body.type) {
        req.body.type = "untrusted";
    }
    if(!req.body.domainName) {
        res.status(400).send({
            message: 'domainName of client required'
        })
    }
    if(!req.body.username) {
        res.status(400).send({
            message: 'username required'
        })
    }
    const  clientToken = await Key.findOne({_id : req.body.id});
    if (!clientToken) {
        res.status(403).send({
            message: 'id not found'
        })
    }
    if(!req.body.TigerAuth){
        res.redirect('https://www.google.com')
    }
    const token = clientToken.token;
    console.log("=============================================="+ token)
    if(!token) {
        res.status(400).send({
            message: 'secret for client not found'
        })
    }
    
    try {

        
        const clientData = await getClientTokenDetail(token, req.body.domainName);
        console.log("---===-" + clientData)
        const cookieArray = req.body.TigerAuth;
        console.log(cookieArray)
        // if (!cookieArray || !cookieArray.length){
        //     res.redirect('https://www.google.com/');
        // }
        let found = false ;
        for (var itr = 0 ; itr < cookieArray.length ; itr ++)
        {
            let userObject =  cookieArray [itr];
            console.log(userObject)
            if (userObject.username === req.body.username) { 
                console.log('------------1');
                console.log(userObject)
               console.log('----2')
                found = true;
                let response = {};
                let havingAllRequired = true ;
                console.log('-------2')
                console.log(userObject)
                const faceTokenCheck =   await tokenVerification(userObject.faceToken);
                if (!faceTokenCheck && clientData.face){
                    response.faceRequiredByClient = true;
                    havingAllRequired = false ;
                } 
                const otpTokenCheck =  await tokenVerification(userObject.otpToken);
                if (!otpTokenCheck && clientData.otp) {
                    response.otpRequiredByClient = true;
                    havingAllRequired = false ;
                }
                const voiceTokenCheck = await tokenVerification(userObject.voiceToken);
                if (!voiceTokenCheck && clientData.voice) {
                    response.voiceRequiredByClient = true;
                    havingAllRequired = false;
                }
                console.log('------2')
                console.log(response)
                if (!havingAllRequired){
                
                    res.status(200).send({
                        link: 'self',
                        response
                    })
                } else {

                }

            }


        }
        if(!found){
            res.redirect('https://www.google.com/');
        } else {
            // const accessToken = await getAccessToken(clientData,req.body.username,res)
            //  console.log(accessToken + "====")
            // res.status(200).send({
            //     accessToken: accessToken
            // })
            console.log('in else')
            console.log(clientData)
            let newClient = {
                domainName: clientData.domainName,
                callbackUrl: clientData.callbackUrl,
                permissions: {
                    name: clientData.permissions.name,
                    username: clientData.permissions.username,
                    phone: clientData.permissions.phone,
                    dob: clientData.permissions.dob,
                    img: clientData.permissions.img,
                    audio: clientData.permissions.audio
                },
                username: req.body.username
        
            };
            console.log('9999' + newClient)
            jwt.sign({user: newClient }, 'TigerAuthAccessToken' ,  async (err,token) => {
                if(err) {
                    throw err;
                    
                } else {
                    console.log(token)
                    const newAccessKey = new  AccessKey({
                        accessToken: token
                    });
                    const dbResponse = await newAccessKey.save();
                    res.status(200).send({
                        link: `http://${clientData.callbackUrl}/${dbResponse._id}`,
                        response: {
                            faceRequiredByClient: false,
                            voiceRequiredByClient: false,
                            otpRequiredByClient: false
                        }
                    })
                    
                }
            
            });

        }

    } catch (err) {
        res.status(400).send({
            err
        })
    }


})





module.exports = router;