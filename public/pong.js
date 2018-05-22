//pong clone
//mouse to control both paddles

var paddleA, paddleB, ball, wallTop, wallBottom
var scoreA = 0
var scoreB = 0
var steps = 8
var MAX_SPEED = 20;

function setup() {
  let myCanvas = createCanvas(800, 600);
  noCursor();
  myCanvas.parent('pong');
  frameRate(30);

  paddleA = createSprite(30, height / 2, 20, 120);
  paddleA.immovable = true;

  paddleB = createSprite(width - 28, height / 2, 20, 120);
  paddleB.immovable = true;

  wallTop = createSprite(width / 2, -30 / 2, width, 30);
  wallTop.immovable = true;

  wallBottom = createSprite(width / 2, height + 30 / 2, width, 30);
  wallBottom.immovable = true;

  ball = createSprite(width / 2, height / 2, 20, 20);
  ball.maxSpeed = MAX_SPEED;

  ball.colorR = 255
  ball.colorG = 195
  ball.colorB = 195
  ball.r = true
  ball.g = true
  ball.b = false
  paddleA.shapeColor = paddleB.shapeColor = ball.shapeColor = color(ball.colorR, ball.colorG, ball.colorB);

  ball.setSpeed(MAX_SPEED, -180);

}

function draw() {
  background(color(0, 0, 0, 50));

  textSize(64)
  fill(color(ball.colorR, ball.colorG, ball.colorB, 25))
  text(scoreA.toString(), width/2 + 100, height/2)
  text(scoreB.toString(), width/2 - 100, height/2)

  paddleA.position.y = constrain(keyDown(87) ? paddleA.position.y - steps : paddleA.position.y, paddleA.height / 2, height - paddleA.height / 2);
  paddleA.position.y = constrain(keyDown(83) ? paddleA.position.y + steps : paddleA.position.y, paddleA.height / 2, height - paddleA.height / 2);

  paddleB.position.y = constrain(keyDown(73) ? paddleB.position.y - steps : paddleB.position.y, paddleA.height / 2, height - paddleA.height / 2);
  paddleB.position.y = constrain(keyDown(75) ? paddleB.position.y + steps : paddleB.position.y, paddleA.height / 2, height - paddleA.height / 2);

  ball.bounce(wallTop);
  ball.bounce(wallBottom);

  if (ball.bounce(paddleA)) {
    var swing = (ball.position.y - paddleA.position.y) / 3;
    ball.setSpeed(MAX_SPEED, ball.getDirection() + swing);
  }

  if (ball.bounce(paddleB)) {
    var swing = (ball.position.y - paddleB.position.y) / 3;
    ball.setSpeed(MAX_SPEED, ball.getDirection() - swing);
  }

  if (ball.position.x < 0) {
    ball.position.x = width / 2;
    ball.position.y = height / 2;
    ball.setSpeed(MAX_SPEED, 0);
    scoreA++
  }

  if (ball.position.x > width) {
    ball.position.x = width / 2;
    ball.position.y = height / 2;
    ball.setSpeed(MAX_SPEED, 180);
    scoreB++
  }

  if (ball.r && ball.colorR >= 165) {
    ball.colorR--
    if (ball.colorR === 165) ball.r = false
  } else if (!ball.r && ball.colorR <= 255) {
    ball.colorR++
    if (ball.colorR === 255) ball.r = true
  }

  if (ball.g && ball.colorG >= 165) {
    ball.colorG--
    if (ball.colorG === 165) ball.g = false
  } else if (!ball.g && ball.colorG <= 255) {
    ball.colorG++
    if (ball.colorG === 255) ball.g = true
  }

  if (ball.b && ball.colorB >= 165) {
    ball.colorB--
    if (ball.colorB === 165) ball.b = false
  } else if (!ball.b && ball.colorB <= 255) {
    ball.colorB++
    if (ball.colorB === 255) ball.b = true
  }
  paddleA.shapeColor = paddleB.shapeColor = ball.shapeColor = color(ball.colorR, ball.colorG, ball.colorB);

  drawSprites();

}

