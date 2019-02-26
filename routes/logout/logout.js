const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../models/user');
/** 
 * Trusted device logging out from 3rd party application => will not make any change in our login of TigerAuth .
 * To be taken care by 3rd party application like TigerAuth itself
*/


/** 
 * Trusted device logging out from tiger Auth => logs out from tigerauth and now no new login with tigerauth possible in 3rd 
party applications
*/
router.post('/', (req,res) => {
    const username = req.body.username;
    const cookieArray = req.cookies.TigerAuth;
    for (var itr =0 ; itr < cookieArray.length ; itr++) {
        const userObject = cookieArray[itr];
        if(userObject.username ===  username){
            cookieArray.splice(itr,1);
        }
    }
    res.cookie("TigerAuth", cookieArray);
    res.send(req.cookies)
})


/** 
 * untrusted device => logout from tigerauth => same as trusted device logout
 */

 /**
  * untrusted device => 3rd party application logout to be taken care by seeing the count
  */
module.exports = router;