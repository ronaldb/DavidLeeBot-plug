exports.pickone = function(data) {
	return data[Math.floor(Math.random() * data.length)]	
}

exports.daysBetween = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
  //take out milliseconds
  difference_ms = difference_ms/1000;
  var seconds = Math.floor(difference_ms % 60);
  difference_ms = difference_ms/60; 
  var minutes = Math.floor(difference_ms % 60);
  difference_ms = difference_ms/60; 
  var hours = Math.floor(difference_ms % 24);  
  var days = Math.floor(difference_ms/24);
  
  return (days === 0 ? '' : days + ' days, ') + (days === 0 && hours === 0 ? '' : hours + ' hours, ') + (days === 0 && hours === 0 && minutes === 0 ? '' : minutes + ' minutes, and ') + seconds + ' seconds';
}

exports.trackStuck = function () {
  var a = { cid: currentsong.id, djid: currentsong.djid};
  setTimeout(function() {
    var b = { cid: currentsong.id, djid: currentsong.djid};
    if ((a.cid === b.cid) && (a.djid === b.djid)) {
      output({text: 'Track stuck, force skipping!', destination: 'chat'});
      bot.moderateForceSkip();
    }
  }, (currentsong.duration * 1000) + 20000);
}

exports.timeStamp = function () {
  var now = new Date();
  var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
  var suffix = ( time[0] < 12 ) ? "AM" : "PM";

  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
  time[0] = time[0] || 12;
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }
  return date.join("/") + " " + time.join(":") + " " + suffix;
}