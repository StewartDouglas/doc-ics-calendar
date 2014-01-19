//createics.js
//created by Ashley Cutmore 2013
//Mantains an up-to-date .ics calendar for DOC students

var xmldoc = require('./lib/xmldoc');
var fs = require('fs'); // File I/O
var startDate = new Date("October 07,2013 09:00");//TO-DO get from HTML

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function calDate(week, day){
    week=week-2;
    day--;
    var date = startDate;
    var dayMS = (24 * 60 * 60 * 1000);
    var weekMS = dayMS * 7;
    var utc = startDate.getTime() + ((dayMS*day)+(weekMS*week));
    var dt = new Date();
    dt.setTime(utc);
    return dt;
}

function convertToIcs(week,day,time,val,id){   
	var event = "";
	console.log(id + " wk:" + week + " d:" + day + " t:" + time + " ::" + val);
	var timeS = pad(time,2,0);
	time++;
	var timeF = pad(time,2,0);
	var loc = val.substr(val.length -3)
	var eDate = calDate(week,day);
	var dayF = pad(eDate.getDate(),0);
	var monF = pad(eDate.getMonth()+1,0);
	var year = eDate.getFullYear();
	var info = val.split(":");
	event += "BEGIN:VEVENT\n";
	event += "DTSTART:"+year+monF+dayF+"T"+timeS+"0000\n";
	event += "DTEND:"+year+monF+dayF+"T"+timeF+"0000\n";
	event += "LOCATION:HXKL"+loc+"\n";
	event += "UID:"+id+"@doc.ic.ac.uk\n";
	event += "DTSTAMP:20130621T120000Z\n";
	event += "SUMMARY:"+info[0]+"\n";
	event += "DESCRIPTION:"+info[1]+"\n";
	event += "SEQUENCE:1\n";
	event += "END:VEVENT\n";
	return event;
}

function getWeeks(val){
    var numbers = val.match(/(\([0-9](.*?)[0-9]\))/);
    numbers = numbers[0];
    numbers = numbers.substring(1);
    numbers = numbers.substring(0,(numbers.length-1));
    return numbers.split("-");
}

//MAIN
fs.readFile('cal.html', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  else {
      // ics file preamble
      var ics = "BEGIN:VCALENDAR\nVERSION:2.0\nMETHOD:PUBLISH\nX-WR-CALNAME:doc.ic.ac.uk\n";
      //clean up html
      var document=data.replace(/<br>/g,":<br />");
      var xml  = new xmldoc.XmlDocument(document);

      var date = xml.descendantWithPath("body.i");
      var date = date.val;
      console.log(date);

      var table = xml.descendantWithPath("body.table.tbody");
      {
      var id = 1;
      var weekDay = false;
      var val = "";
      var day = 1;
      var time = 9;
      var modules;
      table.eachChild(function(child){
	  child.eachChild(function(child){
	      if (weekDay == true){
		  val = child.childNamed("font").val;
		  if(val.length > 5){
		      modules = val.split("::");
		      var i;
		      for (i=0, tot=modules.length; i < tot; i++) {
			  var weeks = getWeeks(modules[i]);
			  weekStart=parseInt(weeks[0]);
			  weekEnd=parseInt(weeks[1]);
			  //populate ics with events
			  for(var z=weekStart;z<=weekEnd;z++){
			  ics += convertToIcs(z,day,time,modules[i],id++);
			  }
		      }
		  }
		  day++;
	      }
	      weekDay = true;
	  });
	  //reset week & advance time
	  weekDay = false;
	  day = 1;
	  time++;
      });
      }
  ics += "END:VCALENDAR";
  // Write the contents of ics to newcal.txt
  fs.writeFile("./newcal.txt", ics, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("New .ics created!");
    }
  }); 
  }
});

