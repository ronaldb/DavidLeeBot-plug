var args = process.argv;

global.fs = require('fs');

global.config;
global.PlugAPI;
global.bot;

function initializeModules () {
    //Creates the bot listener
    try {
        PlugAPI = require('plugapi');
    } catch(e) {
        console.log(e);
        console.log('It is likely that you do not have the plugapi node module installed.'
            + '\nUse the command \'npm install plugapi\' to install.');
        process.exit(33);
    }

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

    bot = new PlugAPI(config.botinfo.auth);
    bot.connect(config.roomid);
}

initializeModules();

bot.on('roomJoin', function(room) {
    console.log("Joined " + room);
});