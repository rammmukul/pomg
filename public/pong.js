//pong clone

var paddleA, paddleB, ball, wallTop, wallBottom
var started = false
var positionSync
var scoreA = 0
var scoreB = 0
var won = null
var steps = 12
var MAX_SPEED = 20

function setup() {
  let myCanvas = createCanvas(800, 600)
  noCursor()
  myCanvas.parent('pong')
  frameRate(30)

  paddleA = createSprite(30, height / 2, 20, 120)
  paddleA.immovable = true

  paddleB = createSprite(width - 30, height / 2, 20, 120)
  paddleB.immovable = true

  wallTop = createSprite(width / 2, -30 / 2, width, 30)
  wallTop.immovable = true

  wallBottom = createSprite(width / 2, height + 30 / 2, width, 30)
  wallBottom.immovable = true

  ball = createSprite(width / 2, height / 2, 20, 20)
  ball.maxSpeed = MAX_SPEED

  ball.colorR = 255
  ball.colorG = 195
  ball.colorB = 195
  ball.r = true
  ball.g = true
  ball.b = false
  paddleA.shapeColor = paddleB.shapeColor = ball.shapeColor = color(ball.colorR, ball.colorG, ball.colorB)
  positionSync = setInterval(()=>socket.emit('position', paddleA.position.y), 100)
}

function draw() {
  background(color(0, 0, 0, 50))

  textSize(64)
  fill(color(ball.colorR, ball.colorG, ball.colorB, 25))
  text(scoreA.toString(), width / 2 - 100, height / 2)
  text(scoreB.toString(), width / 2 + 100, height / 2)

  if (won) {
    text('you ' + won, width / 2 - 200, height / 2 + 200)
  }

  if (keyDown(87)) {
    paddleA.position.y = constrain(paddleA.position.y - steps, paddleA.height / 2, height - paddleA.height / 2)
    socket.emit('position', paddleA.position.y)
  }
  if (keyDown(83)) {
    paddleA.position.y = constrain(paddleA.position.y + steps, paddleA.height / 2, height - paddleA.height / 2)
    socket.emit('position', paddleA.position.y)
  }

  ball.bounce(wallTop)
  ball.bounce(wallBottom)

  if (ball.bounce(paddleA)) {
    var swing = (ball.position.y - paddleA.position.y) / 3
    ball.setSpeed(MAX_SPEED, ball.getDirection() + swing)
    let vel = [ball.position.x, ball.position.y, ball.velocity.x, ball.velocity.y, paddleA.position.y]
    socket.emit('sync', vel)
  }

  if (ball.bounce(paddleB)) {
    var swing = (ball.position.y - paddleB.position.y) / 3
    ball.setSpeed(MAX_SPEED, ball.getDirection() - swing)
  }

  if (ball.position.x < 0) {
    ball.position.x = width / 2
    ball.position.y = height / 2
    ball.setSpeed(MAX_SPEED, 0)
    scoreB++
    socket.emit('restart', [180, scoreA, scoreB])
  }

  if (ball.position.x > width) {
    ball.position.x = width / 2
    ball.position.y = height / 2
    ball.setSpeed(MAX_SPEED, 180)
    scoreA++
    socket.emit('restart', [0, scoreA, scoreB])
  }

  if (ball.r && ball.colorR >= 165) {
    ball.colorR--
    if (ball.colorR <= 165) ball.r = false
  } else if (!ball.r && ball.colorR <= 255) {
    ball.colorR++
    if (ball.colorR >= 255) ball.r = true
  }

  if (ball.g && ball.colorG >= 165) {
    ball.colorG--
    if (ball.colorG <= 165) ball.g = false
  } else if (!ball.g && ball.colorG <= 255) {
    ball.colorG++
    if (ball.colorG >= 255) ball.g = true
  }

  if (ball.b && ball.colorB >= 165) {
    ball.colorB--
    if (ball.colorB <= 165) ball.b = false
  } else if (!ball.b && ball.colorB <= 255) {
    ball.colorB++
    if (ball.colorB >= 255) ball.b = true
  }

  paddleA.shapeColor = paddleB.shapeColor = ball.shapeColor = color(ball.colorR, ball.colorG, ball.colorB)

  drawSprites()
}

socket.on('position', position => {
  paddleB.position.y = constrain(position, paddleB.height / 2, height - paddleB.height / 2)
})

socket.on('room_full', () => {
  started = true
  ball.setSpeed(MAX_SPEED, 0)
  socket.emit('start', 'start')
})

socket.on('start', () => {
  started = true
  ball.setSpeed(MAX_SPEED, 180)
})

socket.on('sync', vel => {
  ball.position.x = width - vel[0]
  ball.position.y = vel[1]
  ball.setVelocity(-vel[2], vel[3])
  paddleB.position.y = vel[4]
})

socket.on('restart', dir => {
  scoreA = dir[2]
  scoreB = dir[1]
  if (Math.max(scoreA, scoreB) >= 10) {
    ball.setSpeed(0, 0)
    won = (scoreA > scoreB) ? 'won' : 'lost'
    socket.emit('restart', [0, scoreA, scoreB])
  } else {
    ball.position.x = width / 2
    ball.position.y = height / 2
    ball.setSpeed(MAX_SPEED, dir[0])
  }
})
