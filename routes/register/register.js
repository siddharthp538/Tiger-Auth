const express = require('express');
const router = express.Router();

router.get('/getFormdata', (req,res)=>{
  res.send({'hello':'success'});
});
module.exports = router;
