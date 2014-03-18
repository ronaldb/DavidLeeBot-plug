exports.onCurateUpdate = function(data) {
	console.log("curateUpdate:", data);
}

exports.onDjAdvance = function(data) {
	console.log("djAdvance:", data);
	if (data !== null) {
		console.log("djAdvance-djs:", data.djs);
	}
}

exports.onDjUpdate = function(data) {
	console.log("djUpdate:", data);
}

exports.onEmote = function(data) {
	console.log("emote:", data);
}

exports.onUserJoin = function(data) {
	console.log("userJoin:", data);
}

exports.onUserLeave = function(data) {
	console.log("userLeave:", data);
}

exports.onUserUpdate = function(data) {
	console.log("userUpdate:", data);
}

exports.onVoteUpdate = function(data) {
	console.log("voteUpdate:", data);
}
