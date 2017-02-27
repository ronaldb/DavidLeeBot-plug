//Displays the list of commands found in ./commands/

exports.name = '.woot';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    var responses = ["I can dig it!",
                     "This song is awesome!!",
                     "Yeah! I can't stop dancing to this!",
                     ":notes: :notes: I can hear this song in my sleep.",
                     "Love this!",
                     "Rock on!"];
    var responseFrance = ["C'est tres bon!",
                          "Cette chanson est génial!",
                          "Yeah! Je ne peux pas arrêter de danser à cela!",
                          ":notes: :notes: Je peux entendre dans mon sommeil cette chanson.",
                          "Je peux le creuser"];
    var response = myutils.pickone(responses);
    console.log(data.name);
    if (data.command == '.lewoot') {
        response = myutils.pickone(responseFrance);
    }
    if (currentsong.song == null) {
        if (data.command == '.lewoot')
            response = "Il n'y a rien à jouer!";
        else
    	    response = "There's nothing playing!";
    }
    else if (data.userid == currentsong.djid) {
        if (data.command == '.lewoot')
            response = "Vous ne pouvez pas woot pour vous-même!";
        else
    	    response = "You can't woot for yourself!";
    }
    else if (currentsong.wooted) {
        if (data.command == '.lewoot')
            response = "Je ne peux pas woot plus fort!";
        else
            response = "I can't woot any louder!";
    }
    else if (data.userid == currentsong.djid) {
        if (currentsong.rolled) {
            response = 'Sorry, you already tried to woot for yourself.';
        }
        else {
            if (data.userid === config.admin) {
                myWoots = 1;
                dieRoll = 1;
            }
            else {
                myWoots = Math.max(Math.min(currentsong.up,5),1);
                dieRoll = Math.floor(Math.random() * 6) + 1;
                console.log(myWoots,dieRoll);
            }
            if (dieRoll <= myWoots) {
                currentsong.wooted = true;
                currentsong.mehed = false;
                bot.woot();
            }
            else {
                response = 'Sorry, I\'m not wooting for you this time...';
            }
            currentsong.rolled = true;
        }
    }
    else {
        currentsong.wooted = true;
        currentsong.mehed  = false;
	    bot.woot();
    }
    output({text: response, destination: data.source, userid: data.userid});
}
