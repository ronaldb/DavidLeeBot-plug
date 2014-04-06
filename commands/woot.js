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
    var response = myutils.pickone(responses);
    if (currentsong.song == null) {
    	response = "There's nothing playing!";
    }
    else if (data.userid == currentsong.djid) {
    	response = "You can't woot for yourself!";
    }
    else if (currentsong.wooted) {
        response = "I can't woot any louder!";
    }
    else {
        currentsong.wooted = true;
        currentsong.mehed  = false;
	    bot.woot();
    }
    output({text: response, destination: data.source, userid: data.userid});
}