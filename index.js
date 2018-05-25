const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')

// let joined = 0
io.on('connection', function (socket) {
  console.log('>>>>>>>>>')

  // socket.on('join', function (name) {
  //   if (joined < 3) io.emit('join', name)
  //   joined++
  // })

  socket.on('position', function (position) {
    socket.broadcast.emit('position', position)
  })

  socket.on('start', function (start) {
    socket.broadcast.emit('start', start)
  })

  socket.on('restart', function (start) {
    socket.broadcast.emit('restart', start)
  })

  socket.on('sync', function (vel) {
    socket.broadcast.emit('sync', vel)
  })
})

app.use(express.static(path.join(__dirname, 'public')))

http.listen(8000, function () {
  console.log('listening on 8000')
})
