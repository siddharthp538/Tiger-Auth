const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const sessionstorage = require('sessionstorage');
const ip = require('../../ip')
const ensureAuthenticated = (req , res , next ) => {
    if(sessionstorage.getItem('sessUser'))
        next();
    

}
router.get('/' , async(req,res) => {
    if( sessionstorage.getItem('sessUser')) {
        console.log('in user/:id' + sessionstorage.getItem('sessUser'))
        //console.log('in req.user', req.user)
        const userData = sessionstorage.getItem('sessUser')
        console.log('userData ,' + userData)
        const  newUser = {
            name: userData.name,
            phone: userData.phone,
            username: userData.username,
            img: userData.img,
            dob: userData.dob
        }
        res.json({
            userData: newUser
        })
    } else {
        res.json({
            userData: null
        })
        
    }
    // if(!userData) {
    //     res.redirect(`https://${ip}:4200/`)
    // } else {
    //     res.json(userData)
    // }
    
})

router.post('/username',ensureAuthenticated,  async (req,res) => {
    const userData = sessionstorage.getItem('sessUser');
    const newUserData = await User.findOneAndUpdate({ _id : userData._id  }, { name: req.body.name ,  dob: req.body.dob , phone: req.body.phone });
    res.status(200).send({
        user: newUserData
    })
})
module.exports = router;