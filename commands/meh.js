//Displays the list of commands found in ./commands/

exports.name = '.meh';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    var response = 'Please... make it stop :unamused:';
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