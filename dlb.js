var PlugAPI = require('./plugapi'); //Use 'npm install plugapi'
var UPDATECODE = 'h90';

// Initialize some configuration options, connect databases, etc.
var args = process.argv;

global.fs = require('fs');
global.events = require('./events.js');

global.config;

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
    var bot = new PlugAPI(auth, UPDATECODE);
    bot.connect(config.roomid);

    //Event which triggers when the bot joins the room
    bot.on('roomJoin', function(data) {
        console.log("I'm alive!");
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
            case ".commands": //Returns a list of the most important commands
                bot.chat("List of Commands: .about, .album, .artist, .calc, .define, .events, .facebook, .forecast, .genre, .google, .github, .props, .similar, .soundcloud, .track, .translate, .wiki, and .woot");
                break;
            case ".hey": //Makes the bot greet the user 
            case ".yo":
            case ".hi":
            case ".hello":
                bot.chat("Well hey there! @"+data.from);
                break;
            case ".woot": //Makes the bot cast an upvote
            case ".dance":
                bot.woot();
                bot.chat("I can dig it!");
                break;
            case ".meh": //Makes the bot cast a downvote
                bot.meh();
                bot.chat("Please... make it stop :unamused:");
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