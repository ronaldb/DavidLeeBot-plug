//Displays the list of commands found in ./commands/

exports.name = '.uptime';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    var response = 'I\'ve been up for ';
    nowTime = new Date();
    uptime = myutils.daysBetween(startDate,nowTime);
    response += uptime;
    output({text: response, destination: data.source, userid: data.userid});
}
