exports.readyEventHandler = function (data) {
    if (config.database.usedb) {
        setUpDatabase();
    }

//	loop();

}

exports.onAdvance = function(data) {
    if (config.debugmode === true) {
		console.log("advance:", inspect(data, {depth: null}));
    }

    var woots = currentsong.positive == 1 ? " woot, " : " woots, ";
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

    populateSongData(data);
//    myutils.trackStuck();
}

exports.onBan = function(data) {
	if (config.debugmode === true) {
		console.log("ban:", data);
	}
}

exports.onBoothCycle = function(data) {
	if (config.debugmode === true) {
		console.log("boothCycle:", data);
	}
}

exports.onBoothLocked = function(data) {
	if (config.debugmode === true) {
		console.log("boothLocked:", data);
	}
}

exports.onChatDelete = function(data) {
	if (config.debugmode === true) {
		console.log("chatDelete:", data);
	}
}

exports.onCommand = function(data) {
	if (config.debugmode === true) {
		console.log("command:", data);
	}
}

exports.onCurateUpdate = function(data) {
	if (config.debugmode === true) {
		console.log("curateUpdate:", data);
	};
	currentsong.snags += 1; // Assuming you can only grab once...
}

exports.onDjUpdate = function(data) {
	if (config.debugmode === true) {
		console.log("djUpdate:", data);
	};
}

exports.onEmote = function(data) {
	if (config.debugmode === true) {
		console.log("emote:", data);
	};
}

exports.onFollowJoin = function(data) {
	if (config.debugmode === true) {
		console.log("followJoin:", data);
	};
}

exports.onGrab = function(data) {
	if (config.debugmode === true) {
		console.log("grab:", data);
	}
}

exports.onModAddDJ = function(data) {
	if (config.debugmode === true) {
		console.log("modAddDJ:", data);
	};
}

exports.onModAddWaitlist = function(data) {
	if (config.debugmode === true) {
		console.log("modAddWaitlist:", data);
	}
}

exports.onModBan = function(data) {
	if (config.debugmode === true) {
		console.log("modBan:", data);
	};
}

exports.onModMoveDJ = function(data) {
	if (config.debugmode === true) {
		console.log("modMoveDJ:", data);
	};
}

exports.onModMute = function(data) {
	if (config.debugmode === true) {
		console.log("modMute:", data);
	};
}

exports.onModRemoveDJ = function(data) {
	if (config.debugmode === true) {
		console.log("modRemoveDJ:", data);
	};
}

exports.onModRemoveWaitlist = function(data) {
	if (config.debugmode === true) {
		console.log("modRemoveWaitlist:", data);
	};
}

exports.onModSkip = function(data) {
	if (config.debugmode === true) {
		console.log("modSkip:", data);
	};
}

exports.onModStaff = function(data) {
	if (config.debugmode === true) {
		console.log("modStaff:", data);
	};
}

exports.onPdjMessage = function(data) {
	if (config.debugmode === true) {
		console.log("pdjMessage:", data);
	};
}

exports.onPdjUpdate = function(data) {
	if (config.debugmode === true) {
		console.log("pdjUpdate:", data);
	};
}

exports.onPing = function(data) {
	if (config.debugmode === true) {
		console.log("ping:", data);
	};
}

exports.onPlaylistCycle = function(data) {
	if (config.debugmode === true) {
		console.log("playlistCycle:", data);
	};
}

exports.onRequestDuration = function(data) {
	if (config.debugmode === true) {
		console.log("requestDuration:", data);
	};
}

exports.onRequestDurationRetry = function(data) {
	if (config.debugmode === true) {
		console.log("requestDurationRetry:", data);
	};
}

exports.onRoomChanged = function(data) {
	if (config.debugmode === true) {
		console.log("roomChanged:", data);
	};
}

exports.onRoomDescriptionUpdate = function(data) {
	if (config.debugmode === true) {
		console.log("roomDescriptionUpdate:", data);
	};
}

exports.onRoomNameUpdate = function(data) {
	if (config.debugmode === true) {
		console.log("roomNameUpdate:", data);
	};
}

exports.onRoomVoteSkip = function(data) {
	if (config.debugmode === true) {
		console.log("roomVoteSkip:", data);
	};
}

exports.onRoomWelcomeUpdate = function(data) {
	if (config.debugmode === true) {
		console.log("roomWelcomeUpdate:", data);
	};
}

exports.onRoomDescriptionUpdate = function(data) {
	if (config.debugmode === true) {
		console.log("roomDescriptionUpdate:", data);
	};
}

exports.onSessionClose = function(data) {
	if (config.debugmode === true) {
		console.log("sessionClose:", data);
	};
}

exports.onSkip = function(data) {
	if (config.debugmode === true) {
		console.log("skip:", data);
	}
	else {
		console.log(myutils.timeStamp(),"Song skipped")
	};
}

exports.onStrobeToggle = function(data) {
	if (config.debugmode === true) {
		console.log("strobeToggle:", data);
	};
}

exports.onUserCounterUpdate = function(data) {
	if (config.debugmode === true) {
		console.log("userCounterUpdate:", data);
	};
}

exports.onUserFollow = function(data) {
	if (config.debugmode === true) {
		console.log("userFollow:", data);
	};
}

exports.onUserJoin = function(data) {
	if (config.debugmode === true) {
		console.log("userJoin:", data);
	}
    if (config.database.usedb === true) {
        if (data.username) {
	    //Add user to user table
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
    }

    setTimeout(function () {
        if (data.username) {
    	    bot.sendChat('Hello, @' + data.username + '!');
        }
        else {
            bot.sendChat('Hello, guest!');
        }
    }, 5000);
}

exports.onUserLeave = function(data) {
	if (config.debugmode === true) {
		console.log("userLeave:", data);
	};
}

exports.onUserUpdate = function(data) {
	if (config.debugmode === true) {
		console.log("userUpdate:", data);
	};
}

exports.onVote = function(data) {
	var roomScore = bot.getRoomScore();

	if (config.debugmode === true) {
		console.log("vote:", data);
		console.log("DJ", data.i, " made ", (data.v == 1 ? "up" : "down"), " vote");
	};

	currentsong.up    = roomScore.positive;
	currentsong.down  = roomScore.negative;
	currentsong.snags = roomScore.grabs;
}
