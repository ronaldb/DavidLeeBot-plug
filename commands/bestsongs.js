//Returns a list of the room's best dj's

exports.name = '.bestsongs';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (config.database.usedb) {
        var response = 'The song plays I\'ve heard with the most woots: ';

        dbclient.query('SELECT CONCAT(song,\' by \',artist) AS TRACK, woot FROM '
            + config.database.dbname + '.' + config.database.tablenames.song + ' ORDER BY woot DESC LIMIT 3')
        .on('result', function(res) {
            res.on('row', function(row) {
                response += row.TRACK + ': ' + row.woot + ' points.  ';
            })
            res.on('end', function(info) {
                output({text: response, destination: data.source, userid: data.userid});
            })
            res.on('error', function(err) {
                console.log('Result error: ' + inspect(err));
                throw(err);
            })
        })
    }
}
