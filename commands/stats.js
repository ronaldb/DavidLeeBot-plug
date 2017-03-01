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
            + ' group by concat(song, \' by \', artist)) as songtbl', null, { useArray: true }, function(err,rows){
            if (err) {
                console.log('Result error: ' + inspect(err));
                throw(err);
            }
            dbclient.query('SELECT @numdjs := count(*) FROM (select * from '
                + config.database.dbname + '.' + config.database.tablenames.song + ' group by djid) as djtable',
                null, { useArray: true }, function(err,rows) {
                if (err) {
                    console.log('Result error: ' + inspect(err));
                    throw(err);
                }
                dbclient.query('SELECT @uniquesongs as uniquesongs, @numdjs as numdjs, '
                    + 'count(*) as total, sum(woot) as woot, avg(woot) as avgwoot, '
                    + 'sum(meh) as meh, avg(meh) as avgmeh FROM '
                    + config.database.dbname + '.' + config.database.tablenames.song, null,
                    { useArray: true }, function(err,rows) {
                    if (err) {
                        console.log('Result error: ' + inspect(err));
                        throw(err);
                    }

                    var response = 'In this room, '
                        + rows[0][2] + ' songs ('
                        + rows[0][0] + ' unique) have been played by '
                        + rows[0][1] + ' DJs with a total of '
                        + rows[0][3] + ' woots and ' + rows[0][5]
                        + ' mehs (avg +' + new Number(rows[0][4]).toFixed(1) 
                        + '/-' + new Number(rows[0][6]).toFixed(1)
                        + ').';
                    output({text: response, destination: data.source, userid: data.userid});
                });
            });
        });
    }
}
