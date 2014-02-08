$(function(){
    //Parameters
    var images = {},
        imageArray = ["leftArm", "legs", "torso", "rightArm", "head", "hair"];

    var totalResources = 6,
        numResourcesLoaded = 0,
        fps = 30;

    var charX = 300,
        charY = 300;

    var context = document.getElementById('canvasId').getContext("2d");

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

    _.each(imageArray, function(name){
        loadImage(name);
    });

    //Methods
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

        context.width = context.width;
        context.drawImage(images["leftArm"], x + 40, y - 42 - breathAmt);
        context.drawImage(images["legs"], x, y);
        context.drawImage(images["torso"], x, y - 50);
        context.drawImage(images["rightArm"], x - 15, y - 42 - breathAmt);
        context.drawImage(images["head"], x - 10, y - 125 - breathAmt);
        context.drawImage(images["hair"], x - 37, y - 138 - breathAmt);

        drawEllipse(x + 47, y - 68 - breathAmt, 8, curEyeHeight); // Left Eye
        drawEllipse(x + 58, y - 68 - breathAmt, 8, curEyeHeight); // Right Eye

        drawEllipse(x + 40, y + 29, 160 - breathAmt, 6); // Shadow
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


});
