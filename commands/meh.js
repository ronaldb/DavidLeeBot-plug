//Displays the list of commands found in ./commands/

exports.name = '.meh';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    var response = 'Please... make it stop :unamused:';
    bot.meh();
    output({text: response, destination: data.source, userid: data.userid});
}