const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')

let players = {}
io.on('connection', function (socket) {
  socket.on('join', function (name) {
    let room = Object.keys(players).length - (Object.keys(players).length % 2)
    players[socket.id] = room
    socket.join(room)
    socket.to(players[socket.id]).broadcast.emit('join', name)
  })

  socket.on('position', function (position) {
    socket.to(players[socket.id]).broadcast.emit('position', position)
  })

  socket.on('room_full', function (start) {
    socket.to(players[socket.id]).broadcast.emit('room_full', start)
  })

  socket.on('start', function (start) {
    socket.to(players[socket.id]).broadcast.emit('start', start)
  })

  socket.on('restart', function (start) {
    socket.to(players[socket.id]).broadcast.emit('restart', start)
  })

  socket.on('sync', function (vel) {
    socket.to(players[socket.id]).broadcast.emit('sync', vel)
  })

  socket.on('retrive', function (vel) {
    socket.to(players[socket.id]).broadcast.emit('retrive', vel)
  })
})

app.use(express.static(path.join(__dirname, 'public')))

http.listen(8000, function () {
  console.log('listening on 8000')
})
