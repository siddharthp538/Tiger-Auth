const express = require('express');
const router = express.Router();
const Credential = require('../../models/credentials');
const jwt = require('jwt');
router.post('/store' , async (req,res) => {
    const username  = req.body.username;
    const domainName = req.body.domainName ;
    const  password = req.body.password;

    const newCred  =await Credential({
        username,
        domainName,
        password
    }).save();

});
router.post('/retrive', (req,res)=>{
    const db = Credential.find({username : req.body.username});
    if(!db){
        res.status(400).send({
            message: 'no user found'
        });
    }
    res.status(200).send({
        message: db.password
    });
});

module.exports=router;