require('dotenv').config()
const express = require('express')

const { SERVER_PORT, API_KEY, API_HOST } = process.env

const app = express();

app.get('/carddata', (req,res) => {
    fetch(`https://omgvamp-hearthstone-v1.p.rapidapi.com/cards?collectible=1`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": API_HOST
        }
    }).then(response => {
        response.json().then(body => {
           return res.status(200).send(body)
            
   
        }).catch(err => {
            return res.status(500).send('Server Error JSON')
        })
   })
   .catch(err => {
       return res.status(500).send('Server Error')
   });
   
})

app.listen(SERVER_PORT, () => console.log(`Now arriving at ${SERVER_PORT}`));

