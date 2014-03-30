exports.onCurateUpdate = function(data) {
	if (config.debugmode) {
		console.log("curateUpdate:", data);
	};
	currentsong.snags += 1; // Assuming you can only grab once...
}

exports.onDjAdvance = function(data) {
    var woots = currentsong.up == 1 ? " woot, " : " woots, ";
    var mehs  = currentsong.down == 1 ? " meh, " : " mehs, ";
    var snags = currentsong.snags == 1 ? " grab." : " grabs.";
    
    var endsongresponse = ':musical_note: ' + currentsong.song + ' stats: '
        + currentsong.up + woots + currentsong.down
        + mehs + currentsong.snags + snags;	
    if (currentsong.song !== null) {
	    bot.chat(endsongresponse);
    }

    if (config.debugmode) {
		console.log("djAdvance:", data);
		if (data !== null) {
			console.log("djAdvance-djs:", data.djs);
		}
    }

	populateSongData(data);
}

exports.onDjUpdate = function(data) {
	if (config.debugmode) {
		console.log("djUpdate:", data);
	};
}

exports.onEmote = function(data) {
	if (config.debugmode) {
		console.log("emote:", data);
	};
}

exports.onUserJoin = function(data) {
	if (config.debugmode) {
		console.log("userJoin:", data);
	}
}

exports.onUserLeave = function(data) {
	if (config.debugmode) {
		console.log("userLeave:", data);
	};
}

exports.onUserUpdate = function(data) {
	if (config.debugmode) {
		console.log("userUpdate:", data);
	};
}

exports.onVoteUpdate = function(data) {
	if (config.debugmode) {
		console.log("voteUpdate:", data);
		console.log("DJ", data.id, " made ", (data.vote == 1 ? "up" : "down"), " vote");
	}

	if (data.vote == 1) {
		// If this is an upvote, remove from downvoters (if there) and add to upvoters
		if (downvoters.indexOf(data.id) !== -1) {
			downvoters.splice(downvoters.indexOf(data.id),1);
		}
		if (upvoters.indexOf(data.id) == -1) {
			upvoters.push(data.id);
		}
	}
	else {
		// downvote, remove from upvoters and add to downvoters
		if (upvoters.indexOf(data.id) !== -1) {
			upvoters.splice(upvoters.indexOf(data.id),1);
		}
		if (downvoters.indexOf(data.id) == -1) {
			downvoters.push(data.id);
		}
	}

	currentsong.up = upvoters.length;
	currentsong.down = downvoters.length;

	if (config.debugmode) {
		console.log("Upvoters",upvoters);
		console.log("Downvoters",downvoters);
	}
}
