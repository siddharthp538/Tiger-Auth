const express = require('express');
const router = express.Router();
const Credential = require('../../models/credentials');
const jwt = require('jwt');
router.post('/store' , async (req,res) => {
    const username  = req.body.username;
    const domainName = req.body.domainName ;
    const  password = req.body.password;

    const newCred  = Credential({
        username,
        domainName,
        password
    })
    jwt.sign({ newCred })
})