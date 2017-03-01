//Displays the list of commands found in ./commands/

exports.name = '.merde';
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    var response = 'Surveille ton langage, @' + data.name + '!';
    output({text: response, destination: data.source, userid: data.userid});
}

