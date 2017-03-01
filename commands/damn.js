//Displays the list of commands found in ./commands/

exports.name = '.damn';
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    var response = 'Mind your language, @' + data.name + '!';
    output({text: response, destination: data.source, userid: data.userid});
}

