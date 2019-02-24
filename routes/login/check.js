const express = require('express');

const router = express.Router();
const User = require('../../models/user');

router.post('/checkUsername', async (req,res)=>{
    if(await User.findOne({username : req.username})) {
        res.redirect('/checkFace');
      } else {
        return res.status(400).send({
          message: 'Wrong Username! Are you a registered user?'
        });
      }
});

router.post('/checkFace', (req,res)=>{
        
});

module.exports = router;