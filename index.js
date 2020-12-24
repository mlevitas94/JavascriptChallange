require('dotenv').config()
const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express();
var http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    }
  });



const { SERVER_PORT, API_KEY, API_HOST } = process.env

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

        return res.status(200).send(response.data)



    })
        .catch(err => {
            console.log(err)
            return res.status(500).send('Server Error')
        });

})

io.on('connection', (socket) => {
    console.log('something connected');

    socket.on('disconnect', () => {
      console.log('disconnected')
    })

    socket.on('createroom', (res) => {
      let newRoom;
      for(let i = 1; i <= 501; i++){
        if(i === 501){
          return res({full: true})
        }
        if(!io.sockets.adapter.rooms.get(`room-${i}`)){
          newRoom = i
          break
        }
      }
      socket.join(`room-${newRoom}`);
      res({newRoom: newRoom})
    })

    socket.on('joinroom', (room, res) => {
      if(!io.sockets.adapter.rooms.get(`room-${room}`) || io.sockets.adapter.rooms.get(`room-${room}`).size >= 2){

        return res({join: false})
      }
      socket.join(`room-${room}`)

      try{
        socket.to(`room-${room}`).emit('someonejoined')
        res({join: true})
      }catch(err){

      }

      
    })

    socket.on('initialize', res => {
      if(Math.floor(Math.random() * 2) === 0){
        res({turn:true})
      }else{
        //other person in room turn is first
      }
    })

  });

http.listen(SERVER_PORT, () => console.log(`Now arriving at ${SERVER_PORT}`));

