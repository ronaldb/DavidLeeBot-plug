//Returns the room's play count, total awesomes/lames, and average awesomes/lames
//in the room

exports.name = '.mystats';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (config.database.usedb) {
        dbclient.query('SET @rownum := 0', null, { useArray: true }, function(err,rows) {
            if (err) {
                console.log('Result error: ' + inspect(err));
                throw(err);
            }
            dbclient.query('SELECT @rank := rank FROM (SELECT @rownum := @rownum + 1 AS '
                + 'rank, djid, POINTS FROM (SELECT djid, sum(woot) as POINTS from '
                + config.database.dbname + '.' + config.database.tablenames.song
                + ' group by djid order by sum(woot) desc) as test) as rank where '
                + 'djid  = :id', { id: data.userid },
                { useArray: true }, function (err,rows) {
                if (err) {
                    console.log('Result error: ' + inspect(err));
                    throw(err);
                }
                dbclient.query('SELECT @rank as rank, count(*) as total, sum(woot) as woot, avg(woot) as avgwoot, '
                    + 'sum(meh) as meh, avg(meh) as avgmeh '
                    + 'FROM '+ config.database.dbname + '.' + config.database.tablenames.song
                    + ' WHERE djid = :id', { id: data.userid },
                    { useArray: true }, function (err, rows) {
                    if (err) {
                        console.log('Result error: ' + inspect(err));
                        throw(err);
                    }
                    console.log('Query result:', inspect(rows[0]));
                    var response = (data.name + ', you have played '
                        + rows[0][1] + ' songs in this room with a total of '
                        + rows[0][2] + ' woots and ' + rows[0][4]
                        + ' mehs (avg +' + new Number(rows[0][3]).toFixed(1) 
                        + '/-' + new Number(rows[0][5]).toFixed(1)
                        + ') (Rank: ' + rows[0][0] + ')');

                    output({text: response, destination: data.source, userid: data.userid});
                });
            });
        });
    }
}
