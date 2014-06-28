//Returns the room's play count, total awesomes/lames, and average awesomes/lames
//in the room

exports.name = '.mystats';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (config.database.usedb) {
        dbclient.query('SET @rownum := 0')
        .on('result', function(res) {
            res.on('error', function(err) {
                console.log('Result error: ' + inspect(err));
                throw(err);
            })
            res.on('end', function(info) {
                dbclient.query('SELECT @rank := rank FROM (SELECT @rownum := @rownum + 1 AS '
                    + 'rank, djid, POINTS FROM (SELECT djid, sum(woot) as POINTS from '
                    + config.database.dbname + '.' + config.database.tablenames.song
                    + ' group by djid order by sum(woot) desc) as test) as rank where '
                    + 'djid like \'' + data.userid + '\'')
                .on('result', function(res) {
                    res.on('error', function(err) {
                        console.log('Result error: ' + inspect(err));
                        throw(err);
                    })
                    res.on('end', function(info) {
                        dbclient.query('SELECT @rank as rank, count(*) as total, sum(woot) as woot, avg(woot) as avgwoot, '
                            + 'sum(meh) as meh, avg(meh) as avgmeh '
                            + 'FROM '+ config.database.dbname + '.' + config.database.tablenames.song
                            + ' WHERE `djid` LIKE \'' + data.userid + '\'')
                        .on('result', function(res) {
                            res.on('row', function(row) {
                                console.log('Query result:', inspect(row));
                                var response = (data.name + ', you have played '
                                    + row.total + ' songs in this room with a total of '
                                    + row.woot + ' woots and ' + row.meh
                                    + ' mehs (avg +' + new Number(row.avgwoot).toFixed(1) 
                                    + '/-' + new Number(row.avgmeh).toFixed(1)
                                    + ') (Rank: ' + row.rank + ')');

                                output({text: response, destination: data.source, userid: data.userid});
                            })
                            res.on('error', function(err) {
                                console.log('Result error: ' + inspect(err));
                                throw(err);
                            })
                        })
                    });
                });
            });
        });
    }
}
