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
        context.drawImage(images["leftArm"], x + 40, y - 42);
        context.drawImage(images["legs"], x, y);
        context.drawImage(images["torso"], x, y - 50);
        context.drawImage(images["rightArm"], x - 15, y - 42);
        context.drawImage(images["head"], x - 10, y - 125);
        context.drawImage(images["hair"], x - 37, y - 138);

        drawEllipse(x + 47, y - 68, 8, 14); // Left Eye
        drawEllipse(x + 58, y - 68, 8, 14); // Right Eye

        drawEllipse(x + 40, y + 29, 160, 6); // Shadow
    }

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

});

