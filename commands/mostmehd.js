//Returns a list of the room's most lamed songs

exports.name = '.mostmehd';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (config.database.usedb) {
        var response = 'The most meh\'d songs I\'ve heard: ';

        dbclient.query('SELECT CONCAT(song,\' by \',artist) AS TRACK, SUM(meh) AS SUM FROM '
            + config.database.dbname + '.' + config.database.tablenames.song
            + ' GROUP BY CONCAT(song,\' by \',artist) ORDER BY SUM '
            + 'DESC LIMIT 3')
        .on('result', function(res) {
            res.on('row', function(row) {
                response += row.TRACK + ': ' + row.SUM + ' mehs.  ';
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
