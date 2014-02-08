$(document).ready(function() {
  $("#game").hide();

  $("#startGame").on('click', function() {

    // Do stuff here to start the game

    $background = $("#site-background");
    $background.addClass('gradient-bg');

    $("#landing").hide();

    $("#game").fadeIn(1000, function() {

    });

  });

});
