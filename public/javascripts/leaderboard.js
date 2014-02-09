$(function(){
    var rootRef = new Firebase('https://hoppydoge.firebaseio.com/leaderboard');

    window.Leaderboard = {}

    Leaderboard.pushName = function(name, score) {
        newRef = rootRef.push();
        if (name =="") { name = "WowUser" }
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
        _.each(leaders, function(leader){
            $("#scoreboard tbody").append("<tr>" +
                    "<td>"+ leader.name +"</td>" +
                    "<td>"+ leader.score +"</td>" +
                "</tr>"
            )
        });
    });
});
