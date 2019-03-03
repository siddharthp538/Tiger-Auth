const express = require('express');
const app = express();
const router = express.Router();
const Activity = require('../../models/activity');
const ObjectId = require('mongodb').ObjectID;


router.post('/getClient', async (req, res) => {
    const domainName = req.body.domainName;
    const ans = await Activity.find({ domainName });
    console.log(ans);
    res.send({
        ans
    });
});


router.get('/', async (req, res) => {
    const a = Activity({
        "username": "siddharthp538",
        "ip": "127.0.0.1",
        "domainName": "hr.com",
        "timeOfLogin": "2:1pm"
    });
    const b = await a.save();
    console.log(b)
    res.send('okay')
})

router.post('/getStats', async (req, res) => {
    // ans = await Activity.aggregate([
    //     {$group: {
    //         //count: {$substr : [ String(createdAt), 5, 2 ] }, 
    //         createdAt: { month: { $month: "$date" } },
    //         numberOfHits: {$sum: 1}
    //     }}
    // ]);
    ans = await Activity.aggregate([
        { $match: { domainName: req.body.domainName } }, 
        { $group: { 
            _id : {$month: "$createdAt"}, 
            numberofbookings: {$sum: 1} 
        }}
    ]);
    res.send(ans);
});

router.post('/getData', (req,res)=>{

});


router.get('/user' , async(req,res) => {
    const dbResponse = await  Activity.aggregate([ { $unwind : $applications }]);
    res.status(200).send({
        dbResponse
    })
})




module.exports = router;