exports.readyEventHandler = function (data) {
    if (config.database.usedb) {
        setUpDatabase();
    }

//	loop();

}

exports.onBoothCycle = function(data) {
	if (config.debugmode) {
		console.log("boothCycle:", data);
	}
}

exports.onBoothLocked = function(data) {
	if (config.debugmode) {
		console.log("boothLocked:", data);
	}
}

exports.onChatDelete = function(data) {
	if (config.debugmode) {
		console.log("chatDelete:", data);
	}
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
	    bot.sendChat(endsongresponse);
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

exports.onFollowJoin = function(data) {
	if (config.debugmode) {
		console.log("followJoin:", data);
	};
}

exports.onModAddDJ = function(data) {
	if (config.debugmode) {
		console.log("modAddDJ:", data);
	};
}

exports.onModBan = function(data) {
	if (config.debugmode) {
		console.log("modBan:", data);
	};
}

exports.onModMoveDJ = function(data) {
	if (config.debugmode) {
		console.log("modMoveDJ:", data);
	};
}

exports.onModRemoveDJ = function(data) {
	if (config.debugmode) {
		console.log("modRemoveDJ:", data);
	};
}

exports.onModSkip = function(data) {
	if (config.debugmode) {
		console.log("modSkip:", data);
	};
}

exports.onUserJoin = function(data) {
	if (config.debugmode) {
		console.log("userJoin:", data);
	}

    //Add user to user table
    if (config.database.usedb) {
        dbclient.query('INSERT INTO ' + config.database.dbname + '.' + config.database.tablenames.user
        + ' (userid, username, lastseen)'
            + 'VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE lastseen = NOW()',
            [data.id, data.username])
        .on('result', function(res) {
        	res.on('error', function(err) {
                console.log('Result error: ' + inspect(err));
                throw(err);
            })
            res.on('end', function(info) {
                console.log('User record added successfully');
            });
        });
    }

    setTimeout(function () {
    	bot.sendChat('Hello, ' + data.username + '!');
    }, 5000);

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
