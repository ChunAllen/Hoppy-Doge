$(function(){
    //Parameters
    var images = {},
        imageArray = ["leftArm", "legs", "torso", "rightArm", "legs-jump",
                      "head", "hair", "leftArm-jump", "rightArm-jump"];

    var totalResources = 9,
        numResourcesLoaded = 0,
        fps = 30;

    var startTime = (new Date()).getTime();


    var myBall = {
        x: 0,
        y: 75,
        width: 10,
        height: 10,
        borderWidth: 5
    };

    var charX = 300,
        charY = 300;

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


    function drawBall(myBall, context) {
        context.beginPath();
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var radius = 20;

        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = '#8ED6FF';
        context.fill();
        context.strokeStyle = 'black';
        context.stroke();
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
        drawDoge(x,y);
        drawBall(myBall, context);
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







});

