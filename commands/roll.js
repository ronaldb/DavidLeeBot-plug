//Displays the list of commands found in ./commands/

exports.name = '.roll';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    var response;
    if (currentsong.djid == data.userid) {
        if (currentsong.rolled) {
            response = 'Sorry, you already rolled this song.';
        }
        else if (currentsong.wooted) {
            response = 'Someone already asked me to woot for you.';
        }
        else {
            myWoots = Math.max(Math.min(currentsong.up,5),1);
            dieRoll = Math.floor(Math.random() * 6) + 1;
            console.log(myWoots,dieRoll);
            if (dieRoll <= myWoots) {
                response = 'Cool! You got a free woot!';
                currentsong.wooted = true;
                bot.woot();
            }
            else {
                response = 'Sorry, you rolled a ' + dieRoll.toString() + ', and you needed a ' + myWoots.toString() + ' or less.';
            }
            currentsong.rolled = true;
        }
    }
    else {
        response = 'Only the current dj can roll the die.';
    }
    output({text: response, destination: data.source, userid: data.userid});
}
