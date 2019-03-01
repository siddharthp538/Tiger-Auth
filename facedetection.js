'use strict';

const request = require('request');
const fs = require('fs');
// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = 'a32d58c5b7464bbb9f7f7f085ea2d2cb';
const paths = require('./routes/login/check');
const p1 = '/home/siddharthp538/Tiger-Auth/r1.jpg';
const p2 = '/home/siddharthp538/Tiger-Auth/r2.jpeg'
// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase = 'https://centralindia.api.cognitive.microsoft.com/face/v1.0/detect';
let faceId1;
let faceId2;
// Request parameters.
const params = {
    'returnFaceId': 'true',
};

fs.readFile(p1, function (err, data) {
    
    if (err) throw err;
    console.log(data);
    const options = {
        uri: uriBase,
        qs: params,
        // body: '{"url": ' + '"' + imageUrl + '"}',
        body: data,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key' : subscriptionKey
        }
    };
    
    request.post(options, (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        return;
      }
      console.log(body);
      faceId1 = JSON.parse(body)[0].faceId;
      console.log(faceId1);
    });
    fs.readFile(p2, function (err, data1) {
        if (err) throw err;
        // console.log(data1);
        const options = {
            uri: uriBase,
            qs: params,
            // body: '{"url": ' + '"' + imageUrl + '"}',
            body: data1,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key' : subscriptionKey
            }
        };
        
        request.post(options, (error, response, body) => {
          if (error) {
            console.log('Error: ', error);
            return;
          }
          console.log(body);
          faceId2 = JSON.parse(body)[0].faceId;
          console.log(faceId2);
          var object1 = {
            faceId1: faceId1,
            faceId2: faceId2
         };
          const body1 = JSON.stringify(object1);
          const op = {
            headers:{
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key' : subscriptionKey
            },
             uri: 'https://centralindia.api.cognitive.microsoft.com/face/v1.0/verify',
             body: body1
            
          };
          request.post(op , (error, response, body3) => {
            if (error) {
              console.log('Error: ', error);
              return;
            }
            console.log('final');
            console.log(body);
        });
        });
    
    
    });
    


});