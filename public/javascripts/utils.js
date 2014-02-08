$(function(){
    //Parameters
    var images = {},
        //imageArray = ["leftArm", "legs", "torso", "rightArm", "legs-jump",
                      //"head", "hair", "leftArm-jump", "rightArm-jump"];
        imageArray = ["1blink", "1eyes", "2frontFoot-jump", "2frontFoot", "3frontFoot-jump",
                      "3frontFoot", "4head", "5body", "7backFoot-jump", "7backFoot",
                      "8backFoot-jump", "8backFoot", "9tail"];

    var totalResources = 13,
        numResourcesLoaded = 0,
        fps = 30,
		ballStartingPosition = 900,
		ballStartingVelocity = 10,
		ballInterval;

	var velocityItems =  Array(10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90, 95, 100);

    var startTime = (new Date()).getTime();


    var myBall = {
        x: 0,
        y: 75,
        width: 10,
        height: 10,
        borderWidth: 5
    };


    var charX = 300,
        charY = 300,
		ballX;

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
    function clearCanvas(){
        context.clearRect(0, 0, W, H);
    }

    function drawDoge(x,y){
        jumpHeight = 45;


        //refactor all this shit jumping
        if (jumping) {
            drawEllipse(x + 40, y + 29, 100 - breathAmt, 4); //Shadow
            y -= jumpHeight;
            context.drawImage(images["leftArm-jump"], x + 40, y - 42 - breathAmt);
            context.drawImage(images["legs-jump"], x - 1, y - 10);
            context.drawImage(images["rightArm-jump"], x - 35, y - 42 - breathAmt);
        } else {
            drawEllipse(x + 40, y + 80, 160 - breathAmt, 6);
        }
        context.drawImage(images["9tail"], x - 130, y - 75 - breathAmt);

        if (jumping) {

        } else {
            context.drawImage(images["8backFoot"], x + 50, y + 5 - breathAmt);
            context.drawImage(images["7backFoot"], x - 40, y - 10- breathAmt);

        }

        context.drawImage(images["5body"], x - 81, y - 74);
        context.drawImage(images["4head"], x - 10, y - 145 - breathAmt);

        if (jumping) {

        } else {
            context.drawImage(images["3frontFoot"], x - 81, y - 10 - breathAmt);
            context.drawImage(images["2frontFoot"], x - 8, y + 20 - breathAmt);
        }
        context.drawImage(images["1eyes"], x + 50, y - 94 - breathAmt); // Left Eye
        //context.drawImage(images["hair"], x - 37, y - 138 - breathAmt);
        //drawEllipse(x + 47, y - 68 - breathAmt, 8, curEyeHeight); // Left Eye
        //drawEllipse(x + 58, y - 68 - breathAmt, 8, curEyeHeight); // Right Eye

    }


    function drawBall(myBall, context, xAxis) {
		if (xAxis > 0){
			context.beginPath();
			ballX = xAxis;
			var centerY = canvas.height / 2;
			var radius = 20;
			context.arc(ballX, centerY, radius, 0, 2 * Math.PI, false);
			context.fillStyle = '#8ED6FF';
			context.fill();
			context.strokeStyle = 'black';
			context.stroke();
		}else{
			// if ball detected the border left canvas
			// increment score here
			clearInterval(ballInterval);
			ballStartingVelocity = velocityItems[Math.floor(Math.random() * velocityItems.length)];
			ballAppear(ballStartingVelocity);
		}
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
        ballInterval = drawBall(myBall, context, ballStartingPosition -= ballStartingVelocity);
    }

	function ballAppear(velocity){
	   ballStartingPosition =  900;
       ballInterval = drawBall(myBall, context, ballStartingPosition -= velocity);
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


    //MOTIONS
    //Blinking eyes
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


	//function animate(myBall, canvas, context, startTime) {
        //// update
		//console.log('allen');
        //var time = (new Date()).getTime() - startTime;

        //var linearSpeed = 100;
        //// pixels / second
        //var newX = linearSpeed * time / 1000;

        //if(newX < canvas.width - myBall.width - myBall.borderWidth / 2) {
          //myBall.x = newX;
        //}

        //context.clearRect(0, 0, canvas.width, canvas.height);
        //drawBall(myBall, context);
    //}

	//var ballInterval = setInterval(animate(myBall, canvas, context, startTime), 1000 / fps);







});

