var PlugAPI = require('./plugapi'); //Use 'npm install plugapi'
var UPDATECODE = 'h90';

// Initialize some configuration options, connect databases, etc.
var args = process.argv;

global.fs = require('fs');
global.events = require('./events.js');
global.commands = new Array();

global.config;
global.bot;

global.currentsong = {
    artist:   null,
    song:     null,
    djname:   null,
    djid:     null,
    up:       0,
    down:     0,
    listeners:0,
    snags:    0,
    id:       null    
}

//Format: output({text: [required], destination: [required],
//                userid: [required for PM], format: [optional]});
global.output = function(data) {
    if(data.destination == 'chat') {
        bot.chat(data.text);
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
    //currentsong = data.room.metadata.current_song;
    currentsong.artist = data.media.author;
    currentsong.song   = data.media.title;
    currentsong.id     = data.media.cid;
    currentsong.djid   = data.currentDJ;
    //currentsong.up = data.room.metadata.upvotes;
    //currentsong.down = data.room.metadata.downvotes;
    //currentsong.listeners = data.room.metadata.listeners;
    //currentsong.started = data.room.metadata.current_song.starttime;
    currentsong.snags = 0;
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

    loadCommands(null);
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

// Instead of providing the AUTH, you can use this static method to get the AUTH cookie via twitter login credentials:
PlugAPI.getAuth({
    username: config.botinfo.username,
    password: config.botinfo.password
}, function(err, auth) { 
    if(err) {
        console.log("An error occurred: " + err);
        return;
    }
    bot = new PlugAPI(auth, UPDATECODE);
    bot.connect(config.roomid);

    //Event which triggers when the bot joins the room
    bot.on('roomJoin', function(data) {
        console.log("I'm alive!");
        populateSongData(data.room);
    });

    //Events which trigger to reconnect the bot when an error occurs
    var reconnect = function() { 
        bot.connect(config.roomid);
    };

    bot.on('close', reconnect);
    bot.on('error', reconnect);

    //Event which triggers when anyone chats
    bot.on('chat', function(data) {
        console.log('chat:', data);

        var command=data.message.split(' ')[0];
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
            default:
                handleCommand(command, qualifier, data.from, data.fromID, "chat");
                break;
        }
    });

    bot.on('curateUpdate', events.onCurateUpdate);
    
    bot.on('djAdvance', events.onDjAdvance);
    
    bot.on('djUpdate', events.onDjUpdate);
    
    bot.on('emote', events.onEmote);

    bot.on('userJoin', events.onUserJoin);

    bot.on('userLeave', events.onUserLeave);

    bot.on('userUpdate', events.onUserUpdate);

    bot.on('voteUpdate', events.onVoteUpdate);
});