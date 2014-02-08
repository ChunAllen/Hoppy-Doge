$(document).ready(function() {

  // A lot of faking for the sake of UI flow

  $background = $("#site-background");
  $("#game").hide();

  $("#startGame").on('click', function() {

    // Do stuff here to start the game

    $background.addClass('gradient-bg');

    $("#landing").hide();
    $("#game-over").hide();

    $("#game").fadeIn(1000, function() {
      $("#game-over").delay(10000).fadeIn(1000);
    });

  });

  $("#reset").on('click', function () {
    $("#game").hide();

    $background.removeClass('gradient-bg');
    $("#landing").show();
  });

});
