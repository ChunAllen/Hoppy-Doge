
$(function() {
  $("#game").hide();

  $("#startGame").on('click', function() {

    // Do stuff here to start the game

    $("#landing").hide();
    $("#game").fadeIn(1000);
  });

})();
