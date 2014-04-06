//Displays the list of commands found in ./commands/

exports.name = '.meh';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    var responses = ["Please... make it stop :unamused:",
                     "This is horrible...",
                     "Oh great... now I'll have nightmares."];
    var response = myutils.pickone(responses);
    if (currentsong.song == null) {
    	response = "There's nothing playing!";
    }
    else if (currentsong.mehed) {
        response = "I know it's bad, but I can only hate it so much...";
    }
    else {
        currentsong.wooted = false;
        currentsong.mehed  = true;
	    bot.meh();
    }
    output({text: response, destination: data.source, userid: data.userid});
}