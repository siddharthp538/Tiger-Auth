const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Client = require('../../models/client');
const encode = require('nodejs-base64-encode');
const Key = require('../../models/key');
var cookies = require('browser-cookies');
const request = require('request')
const ip =  require ('../../ip');
var http = require('http');

router.use(cookieParser());
function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}


router.get('/cookie' , (request, response) => {
    var cookies = parseCookies(request);
    console.log(cookies)
  // To Write a Cookie
  response.writeHead(200, {
    'Set-Cookie': 'mycookie=test',
    'Content-Type': 'text/plain'
  });
  response.end('Hello World\n');
})
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

router.get('/storeInLocalStorage', (req,res) => {

    res.json({
        data: TigerAuth
    })
})
router.get('/setcookie' , (req,res) => {

    
    
    //res.clearCookie("TigerAuth")
    try { 
    console.log(req);
    TigerAuth = JSON.stringify(TigerAuth);
    res.cookie("TigerAuth" ,TigerAuth, { maxAge: 9000000  ,httpOnly : false});
   // res.cookie("TigerAuth" ,TigerAuth, { expires  : new Date(Date.now() + 9999999), maxAge: 9000000 , path: 'http://localhost:3000' , httpOnly : false , domain: "http://localhost:3000" } );
    
    //cookies.set('firstName', 'Lisa');
    //cookies.set('firstName', 'Lisa', {expires: 365}); // Expires after 1 year
   // cookies.set('firstName', 'Lisa', {secure: true, domain: 'localhost:3000'});

  

        //const data = cookies.get('firstName'); 
        

    res.send({

        "ok": true
    });
    } catch (err) {
        console.log(JSON.stringify(err))
        res.status(400).send({
            err
        })
    }
});


function getCookies(callback){

    // request('http://192.168.43.81:4200', function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         return callback(null, response.headers['set-cookie']);
    //     } else {
    //         return callback(error);
    //     }
    // })

    
}




router.get('/getcookie',(req,res) => {
    //  console.log(req)
    // console.log(JSON.stringify(req.headers.cookies["name"]))
    // res.send(JSON.stringify(req.header.cookies["name"]));


    // getCookies(function(err, res){
    //     console.log(err)
    //     if(!err)
    //        console.log(res)
    // })
   
    var cookies = parseCookies(req);
    console.log(cookies)

  // To Write a Cookie
  res.writeHead(200, {
    'Set-Cookie': 'mycookie=test',
    'Content-Type': 'text/plain'
  });
  res.end('Hello World\n');
  

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
    console.log(token  + domainName)
    if (!token)
        throw Error('secretKey of Client required');
    clientDetail =  await getClientSecretKey(domainName);
    console.log(clientDetail)
    if (!clientDetail)
        throw Error('domain Name not registered with TigerAuth');
    return jwt.verify(token, clientDetail.secretKey , (err,authData) => {
        if(err) {
            throw err;
        } else {
            console.log(authData)
            return authData.client;
        }
    })
}


function verifyToken(req, res, next) {
    // Get auth header value
    //console.log(req.headers);
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


router.post('/listUsers', async(req,res)=> {

    console.log("================================================")
    console.log(req.body);
    const domainName = req.body.domainName;
    const type = req.body.type;
    const id = req.body.id ;

    const TigerAuth  = req.body.TigerAuth;
    console.log(TigerAuth)
    if(!req.body.domainName) {
        res.status(400).send({
            message: 'domainName required'
        })
    }
    if(!req.body.type) {
        res.status(400).send({
            message: 'type of device required'
        })
    }
    if(!req.body.id) {
        res.status(400).send({
            message: 'Invalid credentials of domainName'
        })
    }
    console.log('-------' + TigerAuth)
    try {
        const keyData =  await Key.findOne({ _id : id});
        if(!keyData) throw Error('Invalid id');
        if ( TigerAuth) {
            //redirect where 3rd party appln is running like hr , facebook
            // direct to angular listUsers 
            //const link = 'http://localhost:4200/user-list/'+ domainName+ "/" + String(id)+ "/" + type ;
            //console.log(link + " ====1");
            const cookieArray = TigerAuth ;
            let usersData = [];
            for (var itr = 0 ; itr < cookieArray.length ; itr ++)
            {
                let userObject =  cookieArray [itr];
                let dataObject= {};
            
                dataObject.faceTokenCheck =   await tokenVerification(userObject.faceToken);
                dataObject.otpTokenCheck =  await tokenVerification(userObject.otpToken);
                dataObject.voiceTokenCheck = await tokenVerification(userObject.voiceToken);
                dataObject.username = userObject.username;
                usersData.push(dataObject)


            }
            console.log('----2' + usersData)
            if (usersData.length) {
                res.json({
                    link : "user-list",
                    domainName,
                    id,
                    type
                });
            } else  {
                res.json({
                    link: "login",
                    domainName,
                    id: String(id),
                    type,
                })
            }
        
            

            //res.redirect(link)
        } else {
            // if no cookies then to tigerauth login
            // const link = 'http://localhost:4200/'+ domainName+ "/" + String(id)+ "/" + type ;
            // //const link2 = "http://google.com"
            // console.log(link + " ====2");
            // res.json({link : link});
            //res.redirect(link)
            res.json({
                link: "login",
                domainName,
                id: String(id),
                type,
            })
        }



    } catch(err) {
        res.status(400).send({
            err
        })
    }
})


router.get('/:domainName/:type' , verifyToken,  async (req, res) => {
    try{
        
        const domainName = req.params.domainName;
        const type = req.params.type;
        console.log(req.params.domainName)
        if (!req.token) {
            res.status(403).send({
                message: 'secret for client not found'
            })
        }
        console.log("--2" + req.params.domainName);
        if (!req.params.domainName) {
            res.status(400).send({
                message: 'domain Name of client required'
            })
        }
        const clientData = await getClientTokenDetail(req.token, req.params.domainName);
        console.log(clientData);

        const newKey = new Key ({token: req.token});
        const dbResponse = await newKey.save();
        console.log(dbResponse + " ======0")
        const link =  `https://${ip}:4200/transition/` + domainName+ "/" + String(dbResponse._id)+ "/" + type  ;
            console.log(link+" ===2")
            res.json({link : link});

        // console.log(req.cookies)
        // if ( req.cookies.TigerAuth) {
        //     //redirect where 3rd party appln is running like hr , facebook
        //     // direct to angular listUsers 
        //     const link = 'http://localhost:4200/user-list/'+ domainName+ "/" + String(dbResponse._id)+ "/" + type ;
        //     console.log(link + " ====1");
        //     res.send({link : link});
        //     //res.redirect(link)for (var itr = 0 ; itr < cookieArray.length ; itr ++)
        // } else {
        //     // if no cookies then to tigerauth login
        //    
        //     //res.redirect(link)
        // }
    } catch (err) {
        res.status(400).send({
            message: err 
        })
    }
})

router.post('/' ,  async (req,res) => {
    try { 
        console.log('0000000000000000000000000000000000000000000000000000000000000')
        if (!req.body.id) {
            res.status(403).send({
                message: 'Id required'
            })
        }
        const clientToken = await Key.findOne({ _id : req.body.id});
        if(!clientToken) {
            res.status(403).send({
                message: 'Valid Id required'
            })
        }
        console.log(" 9999999999999999999999" + clientToken)
        const token  =  clientToken.token;
        console.log("*********************" +   token)
        if(!token) {
            res.status(400).send({
                message: 'secret for client not found'
            })
        }
        if(!req.body.domainName) {
            res.status(400).send({
                message: 'domainName of client required'
            })
        }
        if (!req.body.type) {
            req.body.type = 'untrusted'
        }
        const cookieArray = req.body.TigerAuth;
        let usersData = [];
        const clientData = await getClientTokenDetail(token, req.body.domainName);
        console.log(clientData)
        if (cookieArray){
            
            for (var itr = 0 ; itr < cookieArray.length ; itr ++){
                let userObject =  cookieArray [itr];
                let dataObject= {};
            
                dataObject.faceTokenCheck =   await tokenVerification(userObject.faceToken);
                dataObject.otpTokenCheck =  await tokenVerification(userObject.otpToken);
                dataObject.voiceTokenCheck = await tokenVerification(userObject.voiceToken);
                dataObject.username = userObject.username;
                usersData.push(dataObject)


            }
        }
        console.log('----2' + usersData)
        res.send({ usersData , clientData });
    } catch(err) {
        res.status(400).send({
            err
        })
    }
    
})

module.exports = router;