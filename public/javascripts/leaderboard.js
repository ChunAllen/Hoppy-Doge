$(function(){
    rootRef = new Firebase('https://hoppydoge.firebaseio.com/leaderboard');

    window.Leaderboard = {}

    Leaderboard.pushName = function(name, score) {
        newRef = rootRef.push();
        newRef.set({name: name, score: score});
        newRef.setPriority(1/score);

        return true;
    }

    Leaderboard.showAll = function(callback) {
        var limit = 10,
            query = "https://hoppydoge.firebaseio.com/leaderboard.json?limit=" + limit;
        $.get(query, function(data){
            callback(data);
        });
    }
});
