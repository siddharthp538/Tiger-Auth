const express = require('express');
const router = express.Router();
const User = require('../../models/user');

const ensureAuthenticated = (req , res , next ) => {
    if(sessionStorage.getItem('user'))
        next();

}
router.get('/:id' , ensureAuthenticated , async(req,res) => {
    const userData = await User.findOne({ _id : req.user.id });
    console.log(userData)
    if(!userData) {
        res.status(403).send({
            message: 'user not found'
        })
    }
    res.send(200).send({
        user: userData
    })
})

router.post('/:id',ensureAuthenticated,  async (req,res) => {
    const newUserData = await User.findOneAndUpdate({ _id : req.params.id  }, { name: req.body.name ,  dob: req.body.dob , phone: req.body.phone });
    res.status(200).send({
        user: newUserData
    })
})