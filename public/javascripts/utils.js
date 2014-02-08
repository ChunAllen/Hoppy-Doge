$(function(){
    //Parameters
    var images = {},
        imageArray = ["leftArm", "legs", "torso", "rightArm", "legs-jump",
                      "head", "hair", "leftArm-jump", "rightArm-jump"];

    var dogeText = ["Much Wow!", "Go Doggy Jump!", "So Skilled!", "Nice Voice!"]

    var totalResources = 9,
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

    function drawDoge(x,y){
        jumpHeight = 45;


        //refactor all this shit jumping

        //Shadow
        if (jumping) {
            drawEllipse(x + 40, y + 29, 100 - breathAmt, 4);
        } else {
            drawEllipse(x + 40, y + 29, 160 - breathAmt, 6);
        }

        if (jumping) {
            y -= jumpHeight;
        }

        if (jumping) {
            context.drawImage(images["leftArm-jump"], x + 40, y - 42 - breathAmt);
        } else {
            context.drawImage(images["leftArm"], x + 40, y - 42 - breathAmt);
        }

        if (jumping) {
            context.drawImage(images["legs-jump"], x - 1, y - 10);
        } else {
            context.drawImage(images["legs"], x, y);
        }

        context.drawImage(images["torso"], x, y - 50);

        if (jumping) {
            context.drawImage(images["rightArm-jump"], x - 35, y - 42 - breathAmt);
        } else {
            context.drawImage(images["rightArm"], x - 15, y - 42 - breathAmt);
        }
        context.drawImage(images["head"], x - 10, y - 125 - breathAmt);
        context.drawImage(images["hair"], x - 37, y - 138 - breathAmt);

        drawEllipse(x + 47, y - 68 - breathAmt, 8, curEyeHeight); // Left Eye
        drawEllipse(x + 58, y - 68 - breathAmt, 8, curEyeHeight); // Right Eye

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
        var x = charX,y = charY;
        context.clearRect ( 0 , 0 , 800 , 600 );
        drawDoge(x,y)
        ballInterval = drawBall(context, ballStartingPosition -= ballStartingVelocity);
        displayScore(dogeScore);

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

