var PlugAPI = require('./plugapi'); //Use 'npm install plugapi'
var UPDATECODE = 'h90';

// Initialize some configuration options, connect databases, etc.
var args = process.argv;

global.fs = require('fs');
global.inspect = require('util').inspect;
global.events = require('./events.js');
global.myutils = require('./myutils.js');
global.commands = new Array();
global.moderators = new Array();
global.startDate = new Date();

global.config;
global.bot;
global.dbclient;

global.currentsong = {
    artist:   null,
    song:     null,
    djname:   null,
    djid:     null,
    up:       0,
    down:     0,
    listeners:0,
    snags:    0,
    wooted:   false,
    mehed:    false,
    rolled:   false,
    id:       null    
}

//Format: output({text: [required], destination: [required],
//                userid: [required for PM], format: [optional]});
global.output = function(data) {
    if(data.destination == 'chat') {
        bot.sendChat(data.text);
    } else if(data.destination == 'pm') {
        bot.pm(data.text, data.userid);
    } else if(data.destination == 'http') {
        response.writeHead(200, {'Content-Type':'text/plain'});
        if(data.format == 'json') {
            response.end(JSON.stringify(data.text));
        } else {
            response.end(data.text);
        }
    }
}

global.populateSongData = function(data) {
    var roomScore = bot.getRoomScore();
    var roomUsers = bot.getUsers();

    currentsong.artist = null;
    currentsong.song   = null;
    currentsong.id     = null;
    currentsong.djid   = null;
    currentsong.wooted = false;
    currentsong.mehed  = false;
    currentsong.rolled = false;
    if (data !== null) {
        if (data.currentDJ !== null) {
            currentsong.djid   = data.currentDJ.id;
        }
        if (data.media !== null) {
            currentsong.artist = data.media.author;
            currentsong.song   = data.media.title;
            currentsong.id     = data.media.cid;
        }
    }

    currentsong.snags = roomScore.grabs;
    currentsong.up    = roomScore.positive;
    currentsong.down  = roomScore.negative;
    currentsong.listeners = roomUsers.length;
    currentsong.started = data.starttime;
}

//Checks if the user id is present in the admin list. Authentication
//for admin-only privileges.
global.admincheck = function(userid) {
    return (userid === config.admin ||
        moderators.some(function(moderatorid) {
            return moderatorid === userid;
        }));
}

function initializeModules () {
    //Creates the config object
    try {
        if (args[2] == '-c' && args[3] != null) {
            config = JSON.parse(fs.readFileSync(args[3], 'ascii'));
        } else {
            config = JSON.parse(fs.readFileSync('config.json', 'ascii'));
        }
    } catch(e) {
        //todo: update error handling
        console.log(e);
        console.log('Error loading config.json. Check that your config file exists and is valid JSON.');
        process.exit(33);
    }

    //Creates mariasql db object
    if (config.database.usedb) {
        try {
            mariasql = require('mariasql');
        } catch(e) {
            console.log(e);
            console.log('It is likely that you do not have the mariadb node module installed.'
                + '\nUse the command \'npm install mariasql\' to install.');
            console.log('Starting bot without database functionality.');
            config.database.usedb = false;
        }
    }

    if (config.database.usedb) {
        //Connects to mariasql server
        try {
            var dbhost = 'localhost';
            if (config.database.login.host != null && config.database.login.host != '') {
                dbhost = config.database.login.host;
            }
            dbclient = new mariasql();
            dbclient.connect({user: config.database.login.user,
                              password: config.database.login.password,
                              database: config.database.dbname,
                              host: dbhost});
        } catch(e) {
            console.log(e);
            console.log('Make sure that a MariaDB server instance is running and that the '
                + 'username and password information in config.js are correct.');
            console.log('Starting bot without database functionality.');
            config.database.usedb = false;
        }
    }

    loadCommands(null);
}

//Sets up the database
global.setUpDatabase = function() {
    //song table
    dbclient.query('CREATE TABLE IF NOT EXISTS ' + config.database.dbname + '.' + config.database.tablenames.song
        + '(id INT(11) AUTO_INCREMENT PRIMARY KEY,'
        + ' artist VARCHAR(255),'
        + ' song VARCHAR(255),'
        + ' djid VARCHAR(255),'
        + ' songid VARCHAR(255),'
        + ' woot INT(3),' + ' meh INT(3),'
        + ' listeners INT(3),'
        + ' started DATETIME,'
        + ' grabs INT(3))')
        .on('result', function(res) {
            res.on('error', function(err) {
                console.log('Result error: ' + inspect(err));
                throw(err);
            })
            res.on('end', function(info) {
                console.log('Song table added successfully');
            });
        });

    //chat table
    dbclient.query('CREATE TABLE IF NOT EXISTS ' + config.database.dbname + '.' + config.database.tablenames.chat
        + '(id INT(11) AUTO_INCREMENT PRIMARY KEY,'
        + ' userid VARCHAR(255),'
        + ' chat VARCHAR(255),'
        + ' time DATETIME)')
        .on('result', function(res) {
            res.on('error', function(err) {
                console.log('Result error: ' + inspect(err));
                throw(err);
            })
            res.on('end', function(info) {
                console.log('Chat table added successfully');
            });
        });

    //user table
    dbclient.query('CREATE TABLE IF NOT EXISTS ' + config.database.dbname + '.' + config.database.tablenames.user
        + '(userid VARCHAR(255), '
        + 'username VARCHAR(255), '
        + 'lastseen DATETIME, '
        + 'PRIMARY KEY (userid, username))')
        .on('result', function(res) {
            res.on('error', function(err) {
                console.log('Result error: ' + inspect(err));
                throw(err);
            })
            res.on('end', function(info) {
                console.log('User table added successfully');
            });
        });

    //banned table
    dbclient.query('CREATE TABLE IF NOT EXISTS ' + config.database.dbname + '.' + config.database.tablenames.banned
        + '(id INT(11) AUTO_INCREMENT PRIMARY KEY, '
        + 'userid VARCHAR(255), '
        + 'banned_by VARCHAR(255), '
        + 'timestamp DATETIME)')
        .on('result', function(res) {
            res.on('error', function(err) {
                console.log('Result error: ' + inspect(err));
                throw(err);
            })
            res.on('end', function(info) {
                console.log('Banned table added successfully');
            });
        });
}

//Adds the song data to the songdata table.
//This runs on the endsong event.
global.addToDb = function(data) {
    dbclient.query(
        'INSERT INTO ' + config.database.dbname + '.' + config.database.tablenames.song + ' '
            + 'SET artist = ?,song = ?, songid = ?, djid = ?, woot = ?, meh = ?,'
            + 'listeners = ?, started = NOW(), grabs = ?',
        [currentsong.artist,
            currentsong.song,
            currentsong.id,
            currentsong.djid,
            currentsong.up,
            currentsong.down,
            currentsong.listeners,
            currentsong.snags])
        .on('result', function(res) {
            res.on('error', function(err) {
                console.log('Result error: ' + inspect(err));
                throw(err);
            })
            res.on('end', function(info) {
                console.log('Song record added successfully');
            });
        });
}

//Loads or reloads commands
function loadCommands (data) {
    var newCommands = new Array();
    var j = 0;
    var response = '';

    try {
        var filenames = fs.readdirSync('./commands');
        var copyFound = false;
        
        for (i in filenames) {
            var command = require('./commands/' + filenames[i]);
            newCommands.push({name: command.name, copies: command.copies, handler: command.handler,
                hidden: command.hidden, enabled: command.enabled, matchStart: command.matchStart});
            j++;
        }
        // Handle commands that copy other commands
        for (copyCommand in newCommands) {
            if (newCommands[copyCommand].copies != null) {
                copyFound = false;
                for (originalCommand in newCommands) {
                    if (newCommands[originalCommand].name == newCommands[copyCommand].copies) {
                        copyFound = true;
                        newCommands[copyCommand].handler = newCommands[originalCommand].handler;
                    }
                }
                if (copyFound == false) {
                    response = 'Copy command "' + newCommands[copyCommand].copies + '" for "' + newCommands[copyCommand].name + '" not found';
                    if (data == null) {
                        console.log(response);
                    }
                    else {
                        output({text: response, destination: data.source, userid: data.userid});
                    }
                }
            }
        }
        commands = newCommands;
        response = j + ' commands loaded.';
        if (data == null) {
            console.log(response);
        }
        else {
            output({text: response, destination: data.source, userid: data.userid});
        }
    } catch (e) {
        response = 'Command reload failed: ' + e;
        if (data == null) {
            console.log(response);
        }
        else {
            output({text: response, destination: data.source, userid: data.userid});
        }
    }
}

function handleCommand (command, text, name, userid, source) {
    for (i in commands) {
        if (commands[i].name == command) {
            commands[i].handler({name: name, userid: userid, text: text, source: source});
            break;
        }
    }
}

initializeModules();

bot = new PlugAPI({
    "email": config.botinfo.username,
    "password": config.botinfo.password
});
bot.connect(config.roomid);

bot.on('roomJoin', function(room) {
    console.log("Joined " + room);

/*
    // Create list of moderators (admins)
    var Staff = bot.getStaff();
    for (var i = Staff.length - 1; i >= 0; i--) {
        if (Staff[i].permission >= config.adminPermission) {
            moderators.push(Staff[i].id);
        }
    };
    events.readyEventHandler();
*/
    bot.sendChat("Hello, world!");
});

//Events which trigger to reconnect the bot when an error occurs
var reconnect = function() { 
    bot.connect(config.roomid);
};

bot.on('close', reconnect);
bot.on('error', reconnect);

//Event which triggers when anyone chats
bot.on('chat', function(data) {
    /* Change in chat data */
    data.fromID = data.raw.uid;
    data.from = data.raw.un;
    
    if (config.debugmode) {
        console.log('chat:', data);
    }


    var command=data.message.split(' ')[0].toLowerCase();
    var firstIndex=data.message.indexOf(' ');
    var qualifier="";
    if (firstIndex!=-1){
        qualifier = data.message.substring(firstIndex+1, data.message.length);
    }
    qualifier=qualifier.replace(/&#39;/g, '\'');
    qualifier=qualifier.replace(/&#34;/g, '\"');
    qualifier=qualifier.replace(/&amp;/g, '\&');
    qualifier=qualifier.replace(/&lt;/gi, '\<');
    qualifier=qualifier.replace(/&gt;/gi, '\>');
    switch (command)
    {
        case '#shutdown':
            // Gracefully logoff and exit with 0 to stop bot
            if (data.fromID == config.admin) {
                bot.leaveBooth();
                bot.sendChat("Shutting down...");
                setTimeout(function() {
                    process.exit(0);
                }, 5000);
            }
            else {
                bot.sendChat("I don't think so, " + data.from + "...");
            }
            break;
        case '#restart':
            // Gracefully logoff and exit with 34 to restart
            if (data.fromID == config.admin) {
                bot.leaveBooth();
                bot.sendChat("Restarting...");
                setTimeout(function() {
                    process.exit(34);
                }, 5000);
            }
            else {
                bot.sendChat("I don't think so, " + data.from + "...");
            }
            break;
        case '#comebacklater':
            // Gracefully logoff and exit with 35 to come back after 10 minutes
            if (data.fromID == config.admin) {
                bot.leaveBooth();
                bot.sendChat("I'll be back later!");
                setTimeout(function() {
                    process.exit(35);
                }, 5000);
            }
            else {
                bot.sendChat("I don't think so, " + data.from + "...");
            }
            break;
        default:
            handleCommand(command, qualifier, data.from, data.fromID, "chat");
            break;
    }
});

bot.on('advance', events.onAdvance);
bot.on('ban', events.onBan);
bot.on('boothCycle', events.onBoothCycle);
bot.on('boothLocked', events.onBoothLocked);
bot.on('chatDelete', events.onChatDelete);
bot.on('command', events.onCommand);
bot.on('emote', events.onEmote);
bot.on('followJoin', events.onFollowJoin);
bot.on('grab',events.onGrab);
bot.on('modAddDJ', events.onModAddDJ);
bot.on('modAddWaitlist',events.onModAddWaitlist);
//bot.on('modAmbassador',events.onModAmbassador);
bot.on('modBan',events.onModBan);
bot.on('modMoveDJ',events.onModMoveDJ);
bot.on('modMute',events.onModMute);
bot.on('modRemoveDJ',events.onModRemoveDJ);
//bot.on('modRemoveWaitList',events.onModRemoveWaitList);
bot.on('modSkip',events.onModSkip);
bot.on('modStaff',events.onModStaff);
bot.on('pdjMessage',events.onPdjMessage);
bot.on('pdjUpdate',events.onPdjUpdate);
bot.on('ping',events.onPing);
bot.on('playlistCycle',events.onPlaylistCycle);
bot.on('requestDuration',events.onRequestDuration);
bot.on('requestDurationRetry',events.onRequestDurationRetry);
bot.on('roomChanged',events.onRoomChanged);
bot.on('roomDescriptionUpdate',events.onRoomDescriptionUpdate);
bot.on('roomNameUpdate',events.onRoomNameUpdate);
bot.on('roomVoteSkip',events.onRoomVoteSkip);
bot.on('roomWelcomeUpdate',events.onRoomWelcomeUpdate);
bot.on('sessionClose',events.onSessionClose);
bot.on('skip',events.onSkip);
bot.on('strobeToggle',events.onStrobeToggle);
bot.on('userCounterUpdate',events.onUserCounterUpdate);
bot.on('userFollow',events.onUserFollow);
bot.on('userJoin', events.onUserJoin);
bot.on('userLeave', events.onUserLeave);
bot.on('userUpdate', events.onUserUpdate);
bot.on('vote',events.onVote);

//Old events - no longer firing
bot.on('curateUpdate', events.onCurateUpdate);
bot.on('djUpdate', events.onDjUpdate);
