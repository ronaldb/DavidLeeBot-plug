//I am Groot!

exports.name = '.groot';
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
	var responses = ["I am Groot!",
                     "I am Groot.",
                     "We are Groot.",
                     "/me begins to chew on a lead protruding from his shoulder",
                     "/me grunts"];
    var response = myutils.pickone(responses);
    output({text: response, destination: data.source, userid: data.userid});
}