window.onload = function () {

      const canvasWidth = 600;
      const canvasHeight = 400;
      const blockSize = 20;
      const delay = 100;
      var ctx;
      var snakee;
      var applee;
      var widthInBlocks = canvasWidth / blockSize;
      var heightInBlocks = canvasHeight / blockSize;
      var score;
      var timeout;

      init();

      function init() {

            var canvas = document.querySelector('canvas');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            // canvas.style.border = "10px solid";
            // canvas.style.backgroundColor = "#252525";
            // document.body.appendChild(canvas);
            ctx = canvas.getContext('2d');
            snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
            applee = new Apple([10, 10]);
            score = 0;
            refreshCanvas();
      }

      function refreshCanvas() {

            snakee.advance();
            if (snakee.checkCollision()) {
                  gameOver();
            } else {
                  if (snakee.isEatingApple(applee)) {
                        score++;
                        snakee.ateApple = true;
                        do {
                              applee.setNewPosition();
                        }
                        while(applee.isOnSnake(snakee))
                  }
                  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                  drawScore();
                  snakee.draw();
                  applee.drawApple();
                  timeout = setTimeout(refreshCanvas, delay);    
            }
            

      }
      function gameOver() {
            ctx.save();
            ctx.font = "bold 30px sans-serif";
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 3;
            var centerX = canvasWidth / 2;
            var centerY = canvasHeight / 2;
            ctx.strokeText("Game Over", centerX, centerY - 120);
            ctx.fillText("Game Over", centerX, centerY - 120);
            ctx.font = "bold 25px sans-serif";
            ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centerX, centerY - 80);
            ctx.fillText("Appuyer sur la touche Espace pour rejouer", centerX, centerY - 80);
            ctx.restore();
      }

      function restart() {
            snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
            applee = new Apple([10, 10]);
            score = 0;
            clearTimeout(timeout);
            refreshCanvas();
      }

      function drawScore() {
            ctx.save();
            ctx.font = "bold 90px sans-serif";
            ctx.fillStyle = "#333";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";     
            var centerX = canvasWidth / 2;
            var centerY = canvasHeight / 2;
            ctx.fillText(score.toString(), centerX, centerY);
            ctx.restore();
      }

      function drawBlock(ctx, position) {
            x = position[0] * blockSize;
            y = position[1] * blockSize;
            ctx.fillRect(x, y, blockSize, blockSize);
      }
      
      function Snake(body, direction) {
            this.body = body;
            this.direction = direction;
            this.ateApple = false;
            this.draw = function() {
                  ctx.save();
                  ctx.fillStyle = "red";
                  for (var i = 0; i < this.body.length; i++) {
                        
                        drawBlock(ctx, this.body[i])
                  }
                  ctx.restore();
            };


            this.advance = function () {
            
                  var nexPosition = this.body[0].slice();

                  switch(this.direction) {
                        case "left":
                              nexPosition[0] -= 1; 
                              break;
                        case "right":
                              nexPosition[0] += 1; 
                              break;
                        case "down":
                              nexPosition[1] += 1; 
                              break;
                        case "up":
                              nexPosition[1] -= 1; 
                              break;
                        default:
                              throw ("Invalid direction");
                  }

                  this.body.unshift(nexPosition);
                  if (!this.ateApple)
                        this.body.pop();
                  else
                        this.ateApple = false;
            };
            this.setDirection = function(newDirection) {
                  var allowedDirection;
                  switch (this.direction) {
                        case "left":
                        case "right":
                              allowedDirection = ["up", "down"];
                              break;
                        case "down":
                        case "up":
                              allowedDirection = ["left", "right"];
                              break;
                        default:
                              throw ("Invadid direction");
                  }
                  if (allowedDirection.indexOf(newDirection) > -1) {
                        this.direction = newDirection;
                  }
                        
            };
            this.checkCollision = function () {
                  var wallCollision = false;
                  var snakeCollision = false;
                  var head = this.body[0];
                  var restOfBody = this.body.slice(1);
                  var coordHeadX = head[0];
                  var coordHeadY = head[1];
                  var minX = 0;
                  var minY = 0;
                  var maxX = widthInBlocks - 1;
                  var maxY = heightInBlocks - 1;
                  var isNotBetweenHorizontalWalls = coordHeadX < minX || coordHeadX > maxX;
                  var isNotBetweenVerticaleWalls = coordHeadY < minY || coordHeadY > maxY;

                  if (isNotBetweenHorizontalWalls || isNotBetweenVerticaleWalls) {
                        wallCollision = true;
                  }
                  for (var i = 0; i < restOfBody.length; i++) {
                        if (coordHeadX === restOfBody[i][0] && coordHeadY === restOfBody[i][1]) {
                              snakeCollision = true;
                        }
                  }
                  return wallCollision || snakeCollision;
            };
            this.isEatingApple = function (appleToEat) {
                  var head = this.body[0];
                  if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                        return true;
                  else
                        return false;
            };
      }
     
      function Apple(position) {
            this.position = position;
            this.drawApple = function () {
                  ctx.save();
                  ctx.fillStyle = "#33cc33";
                  ctx.beginPath();
                  var raduis = blockSize / 2;
                  var coordAppleX = this.position[0] * blockSize + raduis;
                  var coordAppleY = this.position[1] * blockSize + raduis;
                  ctx.arc(coordAppleX, coordAppleY, raduis, 0, Math.PI * 2, true);
                  ctx.fill();
                  ctx.restore();
            };
            this.setNewPosition = function () {
                  var newX = Math.round(Math.random() * (widthInBlocks - 1));
                  var newY = Math.round(Math.random() * (heightInBlocks - 1));
                  this.position = [newX, newY];
            };
            this.isOnSnake = function (snakeToChech) {
                  var isOnSnake = false;
                  for (var i = 0; i < snakeToChech.body.length; i++) {
                        if (this.position[0] === snakeToChech.body[i][0] && this.position[1] === snakeToChech.body[i][1]) {
                              isOnSnake = true;
                        }
                  }
                  return isOnSnake;
            };
      }

      document.onkeydown = function handleKeyDown(e) {
            var key = e.keyCode; 
            var newDirection;
            switch (key) {
                  case 37:
                        newDirection = "left";
                        break;
                  case 38:
                        newDirection = "up";
                        break;
                  case 39:
                        newDirection = "right";
                        break;
                  case 40:
                        newDirection = "down";
                        break;
                  case 32:
                        restart();
                        return;
                  default:
                        return;
            }
            snakee.setDirection(newDirection);
      }


}