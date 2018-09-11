var socket = io()

socket.on('join', name => {
  if (me && name !== me) {
    socket.emit('room_full', 'room_full')
  }
})

var me = Math.random()
socket.emit('join', me)
