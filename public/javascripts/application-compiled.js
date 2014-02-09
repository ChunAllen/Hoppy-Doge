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
		  //$("#game-over").delay(10000).fadeIn(1000);
		});

	  });

	  $("#reset").on('click', function () {
		$("#game").hide();

		$background.removeClass('gradient-bg');
      $("#landing").fadeIn(1000);
	  });

    createSpacers();
});

function createSpacers() {
   var spacers = document.querySelectorAll("[class^='vspacer']");

  for (var x = 0; x < spacers.length; x++ ){
    var spacer_height = spacers[x].className.split('-')[1];
    spacers[x].style.height = spacer_height + "px";
  }
}
