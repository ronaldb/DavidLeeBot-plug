//Returns a list of the room's worst dj's

exports.name = '.worstdjs';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (config.database.usedb) {
        var response = 'The DJs with the most mehs accrued in this room: ';

        dbclient.query('SELECT username, downvotes FROM (SELECT djid, sum(meh) AS downvotes '
            + 'FROM ' + config.database.dbname + '.' + config.database.tablenames.song
            + ' GROUP BY djid ORDER BY sum(meh) DESC LIMIT 3) a INNER JOIN (SELECT * FROM (SELECT * FROM '
                + config.database.dbname + '.' + config.database.tablenames.user
            + ' ORDER BY lastseen DESC) as test GROUP BY userid)'
            + ' b ON a.djid = b.userid ORDER BY downvotes DESC LIMIT 3')
        .on('result', function(res) {
            res.on('row', function(row) {
                response += row.username + ': ' + row.downvotes + ' mehs.  ';
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
