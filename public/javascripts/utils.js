$(function(){
    //Parameters
    var images = {},
        imageArray = ["1blink", "1eyes", "2frontFoot-jump", "2frontFoot", "3frontFoot-jump",
                      "3frontFoot", "4head", "5body", "7backFoot-jump", "7backFoot",
                      "8backFoot-jump", "8backFoot", "9tail", "hit", "hitjump"];

    var dogeText = ["Much Wow!", "Go Doggy Jump!", "So Skilled!", "Nice Voice!"]
    var totalResources = 15,
        numResourcesLoaded = 0,
        fps = 30,
		ballStartingPosition = 900,
		ballStartingVelocity = 5,
		ballInterval,
        imageObj = new Image(),
        charX = 300,
        charY = 300,
		ballX,
        dogeScore = 0
        ball =  "0",
        bird = "1";


	var velocityItems =  [10, 15, 20, 25, 30];

    var canvas = document.getElementById('canvasId');
    var context = canvas.getContext("2d");

    var breathInc = 0.1,
        breathDir = 1,
        breathAmt = 0,
        breathMax = 2,
        breathInterval = setInterval(updateBreath, 1000 / fps);

    var maxEyeHeight = 14,
        curEyeHeight = maxEyeHeight,
        eyeOpenTime = 0,
        timeBtwBlinks = 4000,
        blinkUpdateTime = 200,
        blinkTimer = setInterval(updateBlink, blinkUpdateTime);

    var jumping = false;

    _.each(imageArray, function(name){
        loadImage(name);
    });



    //Methods
    function randomBall(){
     var r = Math.random();
     // 50/50 chance to return a bird
     return r < 0.5 ? ball.charAt(Math.floor(r*ball.length*2)) : bird.charAt(Math.floor((r-0.5)*bird.length*2));
    }

    function clearCanvas(){
        context.clearRect(0, 0, W, H);
    }

    function drawHitDoge(x,y) {
        if (jumping) {
            drawEllipse(x + 10, y + 75, 200 - breathAmt, 4);
            y -= jumpHeight;
            context.drawImage(images["hitjump"], x - 130, y - 150);
        } else {
            drawEllipse(x + 10, y + 75, 300 - breathAmt, 10);
            context.drawImage(images["hit"], x - 130, y - 150);
        }
    }

    function drawDoge(x,y){
        jumpHeight = 45;

        if (jumping) {
            drawEllipse(x + 10, y + 75, 200 - breathAmt, 4);
            y -= jumpHeight;
        } else {
            drawEllipse(x + 10, y + 75, 300 - breathAmt, 10);
        }
        context.drawImage(images["9tail"], x - 130, y - 75 - breathAmt);

        if (jumping) {
            context.drawImage(images["8backFoot-jump"], x + 45, y + 12);
            context.drawImage(images["7backFoot-jump"], x - 55, y - 10);
        } else {
            context.drawImage(images["8backFoot"], x + 50, y + 5);
            context.drawImage(images["7backFoot"], x - 40, y - 10);

        }

        context.drawImage(images["5body"], x - 81, y - 74);
        context.drawImage(images["4head"], x - 10, y - 145 - breathAmt);

        if (jumping) {
            context.drawImage(images["3frontFoot-jump"], x - 111, y - 10);
            context.drawImage(images["2frontFoot-jump"], x - 8, y + 20);
        } else {
            context.drawImage(images["3frontFoot"], x - 81, y - 10);
            context.drawImage(images["2frontFoot"], x - 8, y + 20);
        }

        if (curEyeHeight === 14) {
            context.drawImage(images["1eyes"], x + 50, y - 94 - breathAmt); // Left Eye
        } else {
            context.drawImage(images["1blink"], x + 50, y - 94 - breathAmt); // Left Eye
        }
    }

    function getDogeCoords(x,y) {
        var dogeBox = {
            frontX: 0,
            frontY: 0,
            backX: 0,
            backY: 0,
            width: 0,
        }

        if (jumping) {
            dogeBox.frontX = x + 70;
            dogeBox.frontY = y;
            dogeBox.backX = x - 121;
            dogeBox.backY = y;
        } else {
            dogeBox.frontX = x + 60;
            dogeBox.frontY = y + 20;
            dogeBox.backX = x - 91;
            dogeBox.backY = y + 20;
        }

        dogeBox.width = dogeBox.frontX - dogeBox.backX;

        return dogeBox;
    }

    function getBallCoords(x, y) {
        var ballBox = {
            frontX: x - 20,
            frontY: y,
            topX: x,
            topY: y + 20,
            backX: x + 20,
            backY: y
        }

        return ballBox;
    }

    function drawBall(context, xAxis) {
		if (xAxis > 0){
            ballImage(0, xAxis, canvas.height / 2);
		}else{
			// if ball detected the border left canvas
			clearInterval(ballInterval);
            // set random velocity
            ballStartingVelocity = velocityItems[Math.floor(Math.random() * velocityItems.length)];
            // ball re-entry
            ballAppear(ballStartingVelocity);
		}
    }


    function displayScore(score){
      context.font = 'italic 40pt Calibri';
      context.fillText(score, 150, 100);
    }

    function randomDogeText(text){

      var randomText = Math.floor(Math.random()* text.length);
      context.font = 'italic 40pt Calibri';
      context.fillText(text[randomText], 300, 100);
    }


    function loadImage(name) {
        images[name] = new Image();
        images[name].onload = function() {
            resourceLoaded();
        }
        images[name].src = "/images/" + name + ".png"
    }

    function resourceLoaded(){
        numResourcesLoaded += 1;
        if(numResourcesLoaded === totalResources) {
            setInterval(redraw, 1000 / fps);
        }
    }

    function redraw(){
        var x = charX,
            y = charY;

        context.clearRect ( 0 , 0 , 800 , 600 );
        drawDoge(x,y)


        //maybe move this to another function
        if(collide(x,y, ballStartingPosition)) {
            drawHitDoge(x,y);
        } else {
            drawDoge(x,y);
            displayScore(dogeScore);
        }

        ballInterval = drawBall(context, ballStartingPosition -= ballStartingVelocity);
    }

    function collide(dogeX, dogeY, ballPosition){
        var collision = false;

        var currentDogeCoords = getDogeCoords(dogeX,dogeY),
            currentBallCoords = getBallCoords(ballPosition, canvas.height/2);

        var rangeOfDogeX = _.range(currentDogeCoords.backX, currentDogeCoords.frontX, 1),
            rangeOfDogeY = _.range(currentDogeCoords.frontY, currentDogeCoords.frontY + 20);

        if (_.contains(rangeOfDogeX, currentBallCoords.frontX) && _.contains(rangeOfDogeY, currentBallCoords.frontY ) ||
            _.contains(rangeOfDogeX, currentBallCoords.topX) && _.contains(rangeOfDogeY, currentBallCoords.topY ) ||
            _.contains(rangeOfDogeX, currentBallCoords.backX) && _.contains(rangeOfDogeY, currentBallCoords.backY )) {
            collision = true;
        }

        return collision;
    }

	function ballAppear(velocity){
       //increment score
       dogeScore += 1;
       setInterval(randomDogeText(dogeText), 1000/ 10);
       ballStartingPosition =  900;
       ballInterval = drawBall(context, ballStartingPosition -= velocity);
	}

    //Game Utils
    function drawEllipse(centerX, centerY, width, height) {

      context.beginPath();

      context.moveTo(centerX, centerY - height/2);

      context.bezierCurveTo(
        centerX + width/2, centerY - height/2,
        centerX + width/2, centerY + height/2,
        centerX, centerY + height/2);

      context.bezierCurveTo(
        centerX - width/2, centerY + height/2,
        centerX - width/2, centerY - height/2,
        centerX, centerY - height/2);

      context.fillStyle = "black";
      context.fill();
      context.closePath();
    }



    //MOTIONS
    //Blinking eyes
    function updateBreath() {
        if (breathDir === 1) {
            breathAmt -= breathInc;
            if (breathAmt < - breathMax) {
                breathDir = -1;
            }
        } else {
            breathAmt += breathInc;
            if (breathAmt > breathMax) {
                breathDir = 1;
            }
        }
    }

    function blink() {
        curEyeHeight -= 1;
        if (curEyeHeight <= 0) {
            eyeOpenTime = 0;
            curEyeHeight = maxEyeHeight;
        } else {
            setTimeout(blink, 10);
        }
    }

    function updateBlink() {
        eyeOpenTime += blinkUpdateTime;

        if(eyeOpenTime >= timeBtwBlinks) {
            blink();
        }
    }

    //Jumping
    window.jump = function() {
        if (!jumping) {
            jumping = true;
            setTimeout(land, 500);
        }
    }

    function land() {
        jumping = false;
    }

    // ball Image
    function ballImage(fileNum, ballX ,ballY){
      context.drawImage(imageObj, ballX, ballY);
      imageObj.src = "/images/" + fileNum + ".png";
    }


});

