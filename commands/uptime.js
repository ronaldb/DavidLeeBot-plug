//Displays the list of commands found in ./commands/

exports.name = '.uptime';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
	var now = new Date();
    var response = 'I''ve been up for ' + myUtils.daysBetween(startTime,now); 
    output({text: response, destination: data.source, userid: data.userid});
}