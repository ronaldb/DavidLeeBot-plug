exports.onCurateUpdate = function(data) {
	console.log("curateUpdate:", data);
}

exports.onDjAdvance = function(data) {
    var woots = currentsong.up == 1 ? " woot, " : " woots, ";
    var mehs  = currentsong.down == 1 ? " meh, " : " mehs, ";
    var snags = currentsong.snags == 1 ? " grab." : " grabs.";
    
    var endsongresponse = ':musical_note: ' + currentsong.song + ' stats: '
        + currentsong.up + woots + currentsong.down
        + mehs + currentsong.snags + snags;	
    bot.chat(endsongresponse);

	console.log("djAdvance:", data);
	if (data !== null) {
		console.log("djAdvance-djs:", data.djs);
	}
	populateSongData(data);
}

exports.onDjUpdate = function(data) {
	console.log("djUpdate:", data);
}

exports.onEmote = function(data) {
	console.log("emote:", data);
}

exports.onUserJoin = function(data) {
	console.log("userJoin:", data);
}

exports.onUserLeave = function(data) {
	console.log("userLeave:", data);
}

exports.onUserUpdate = function(data) {
	console.log("userUpdate:", data);
}

exports.onVoteUpdate = function(data) {
	console.log("voteUpdate:", data);
}
