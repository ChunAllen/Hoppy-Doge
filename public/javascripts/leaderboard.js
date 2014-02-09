$(function(){
    var rootRef = new Firebase('https://hoppydoge.firebaseio.com/leaderboard');

    window.Leaderboard = {}

    Leaderboard.pushName = function(name, score) {
        newRef = rootRef.push();
        if (name =="") { name = "WowUser" }
        if (score > 100) { leader.score = 0;}
        newRef.set({name: name, score: score});
        if (score == 0) {score = 1};
        newRef.setPriority(1/score);

        return true;
    }

    Leaderboard.showAll = function(callback) {
        var limit = 5;
        var query = rootRef.startAt().limit(limit);
        query.on('value', function(childSnapshot){
            callback(childSnapshot.val());
        });

    }

    Leaderboard.showAll(function(leaders){
        $("#scoreboard tbody").empty();
        var counter = 1;
        _.each(leaders, function(leader){
            $("#scoreboard tbody").append("<tr>" +
                    "<td>"+ $('<span/>').text(counter).html() + "</td>" +
                    "<td>"+ $('<span/>').text(leader.name.substring(0,10)).html() +"</td>" +
                    "<td>"+ $('<span/>').text(leader.score).html() +"</td>" +
                "</tr>"
            )
            counter++;
        });
    });
});
