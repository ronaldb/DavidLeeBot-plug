//Displays the list of commands found in ./commands/

exports.name = '!add';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    var response = 'Play that funky music, @' + data.text + '!';
    var djToAdd = null;

    if (admincheck(data.userid)) {
	    var roomUsers = bot.getUsers();
	    var waitList = bot.getWaitList();

	    console.log("Waitlist", waitList);

	    for (var i = roomUsers.length - 1; i >= 0; i--) {
	    	if (roomUsers[i].username == data.text) {
	    		djToAdd = roomUsers[i].id;
	    		break;
	    	}
	    }

	    // Is this the current DJ?
	    // or Is DJ already in the waitlist?
	    if (djToAdd === currentsong.djid) {
	    	response = "That is the DJ currently playing!";
	    }
	    else if (waitList.some(function(waiter) {
	    		return waiter.id === djToAdd;
	    	})) {
	    	response = 'That DJ is already in the waitlist!';
	    }
	    else {
    		bot.moderateAddDJ(roomUsers[i].id);
		}
		output({text: response, destination: data.source, userid: data.userid});
    }
}