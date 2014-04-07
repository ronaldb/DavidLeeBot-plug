exports.readyEventHandler = function (data) {
    if (config.database.usedb) {
        setUpDatabase();
    }

//	loop();

}

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
	    //Log song in DB
	    if (config.database.usedb) {
	        addToDb();
	    }
	    bot.chat(endsongresponse);
    }

    if (config.debugmode) {
		console.log("djAdvance:", inspect(data, {depth: null}));
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
	var roomScore = bot.getRoomScore();

	if (config.debugmode) {
		console.log("voteUpdate:", data);
		console.log("DJ", data.id, " made ", (data.vote == 1 ? "up" : "down"), " vote");
	}

	currentsong.up = roomScore.positive;
	currentsong.down = roomScore.negative;
	currentsong.snags = roomScore.curates;
}
