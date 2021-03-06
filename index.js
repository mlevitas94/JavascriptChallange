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

//requests data from hearthstone API and serves it
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

//set socket listeners upon socket connection
io.on('connection', (socket) => {
  console.log('something connected');
  socket.leave(socket.id)

  //leaves all rooms upon disconnection
  socket.on('disconnecting', () => {
    console.log(socket.rooms)
    socket.rooms.forEach(room => {
      console.log(room)
      socket.to(room).emit('playerdisconnected')
    })
  })

  //creates room and joins it
  socket.on('createroom', (res) => {
    if (socket.rooms.size > 2) {
      return res({ tooManyRooms: true })
    }
    let newRoom;
    for (let i = 1; i <= 501; i++) {
      if (i === 501) {
        return res({ full: true })
      }
      if (!io.sockets.adapter.rooms.get(`room-${i}`)) {
        newRoom = i
        break
      }
    }
    socket.join(`room-${newRoom}`);
    res({ newRoom: newRoom })
  })

  //joins room from incoming typed data
  socket.on('joinroom', (room, res) => {
    if (!io.sockets.adapter.rooms.get(`room-${room}`) || io.sockets.adapter.rooms.get(`room-${room}`).size >= 2) {

      return res({ join: false })
    }
    socket.join(`room-${room}`)

    try {
      const turn = Math.floor(Math.random() * 2)
      socket.to(`room-${room}`).emit('someonejoined', turn === 0 ? 1 : 0)
      res({ join: true, turn: turn })
    } catch (err) {
      console.log(err)
    }
  })

  //emits selected grid to waiting player and places the element on the front end
  socket.on('turntaken', (gridElement) => {
    socket.rooms.forEach(room => {
      socket.to(room).emit('waitingturn', gridElement)
    })
  })

  //sets other player's front end variable to show that this player is ready to play again
  socket.on('playagain', () => {
    socket.rooms.forEach(room => {
      socket.to(room).emit('playagainconfirmed')
    })
  })

  //random turn initialization and starts game on front end
  socket.on('initplayagain', (res) => {
    const turn = Math.floor(Math.random() * 2)
    try{
      socket.rooms.forEach( room => {
         socket.to(`${room}`).emit('playagainconfirmed', turn === 0 ? 1 : 0)
      })
      res({turn : turn})
    }catch(err){
      console.log(err)
    }

  })

});

http.listen(SERVER_PORT, () => console.log(`Now arriving at ${SERVER_PORT}`));

