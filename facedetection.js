'use strict';

const request = require('request');
const fs = require('fs');
// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = 'a32d58c5b7464bbb9f7f7f085ea2d2cb';

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase = 'https://centralindia.api.cognitive.microsoft.com/face/v1.0/detect';
let faceId1;
let faceId2;
const imageUrl =
    'https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwjwrfCl7c7gAhWTeysKHRSpAt8QjRx6BAgBEAU&url=https%3A%2F%2Fwww.bollywoodlife.com%2Fnews-gossip%2Fwas-ranbir-kapoors-name-ved-sahni-in-his-college-days-view-pic%2Fattachment%2F57936-still-image-of-ranbir-kapoor-jpg%2F&psig=AOvVaw2HWmFO2MlrolFPs1QRCOjv&ust=1550908167087784';

// Request parameters.
const params = {
    'returnFaceId': 'true',
};

fs.readFile('r1.jpg', function (err, data) {
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
    fs.readFile('r2.jpeg', function (err, data1) {
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
          faceId2 = JSON.parse(body)[0].faceId;
          console.log(faceId2);
          const op = {
            headers:{
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key' : subscriptionKey
            },
             uri: 'https://centralindia.api.cognitive.microsoft.com/face/v1.0/verify',
             body: JSON.stringify({
                faceId1: faceId1,
                faceId2: faceId2
             })
            
          }
          request.post(op , (error, response, body) => {
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
