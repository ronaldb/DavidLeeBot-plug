//Returns the room's play count, total awesomes/lames, and average awesomes/lames
//in the room

exports.name = '.stats';
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    if (config.database.usedb) {
        dbclient.query('SELECT @uniquesongs := count(*) FROM (select * from '
            + config.database.dbname + '.' + config.database.tablenames.song
            + ' group by concat(song, \' by \', artist)) as songtbl')
        .on('result', function(res) {
            res.on('error', function(err) {
                console.log('Result error: ' + inspect(err));
                throw(err);
            })
            res.on('end', function(info) {
                dbclient.query('SELECT @numdjs := count(*) FROM (select * from '
                    + config.database.dbname + '.' + config.database.tablenames.song + ' group by djid) as djtable')
                .on('result', function(res) {
                    res.on('error', function(err) {
                        console.log('Result error: ' + inspect(err));
                        throw(err);
                    })
                    res.on('end', function(info) {
                        dbclient.query('SELECT @uniquesongs as uniquesongs, @numdjs as numdjs, '
                            + 'count(*) as total, sum(woot) as woot, avg(woot) as avgwoot, '
                            + 'sum(meh) as meh, avg(meh) as avgmeh FROM '
                            + config.database.dbname + '.' + config.database.tablenames.song)
                        .on('result', function(res) {
                            res.on('row', function(row) {
                                console.log('Query result:', inspect(row));
                                var response = ('In this room, '
                                    + row.total + ' songs ('
                                    + row.uniquesongs + ' unique) have been played by '
                                    + row.numdjs + ' DJs with a total of '
                                    + row.woot + ' woots and ' + row.meh
                                    + ' mehs (avg +' + new Number(row.avgwoot).toFixed(1) 
                                    + '/-' + new Number(row.avgmeh).toFixed(1)
                                    + ').');
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
