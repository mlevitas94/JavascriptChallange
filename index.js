require('dotenv').config()
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const { SERVER_PORT, API_KEY, API_HOST } = process.env

const app = express();

app.get('/carddata', cors(), (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://omgvamp-hearthstone-v1.p.rapidapi.com/info',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': API_HOST
        }
    };
    axios.request(`https://omgvamp-hearthstone-v1.p.rapidapi.com/cards?collectible=1`, options).then(response => {
        console.log(response)

        return res.status(200).send(response.data)



    })
        .catch(err => {
            console.log(err)
            return res.status(500).send('Server Error')
        });

})

app.listen(SERVER_PORT, () => console.log(`Now arriving at ${SERVER_PORT}`));

