//Displays the list of commands found in ./commands/

exports.name = '.woot';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    var response = 'I can dig it!';
    bot.woot();
    output({text: response, destination: data.source, userid: data.userid});
}