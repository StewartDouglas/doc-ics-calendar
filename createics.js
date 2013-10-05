//createics.js
//created by Ashley Cutmore 2013
//Mantains an up-to-date .ics calendar for DOC students

var xmldoc = require('./xmldoc');
var fs = require('fs');

fs.readFile('cal.html', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  else {
      //clean up html
      var document=data.replace(/<br>/g,"<br />");
      var xml  = new xmldoc.XmlDocument(document);

      var body = xml.childNamed("body");

      var date = body.childNamed("i");
      var date = date.val;
      console.log(date);

      var table = body.childNamed("table");
      var table = table.childNamed("tbody");
      var i = 1;
      table.eachChild(function(child){
	  child.eachChild(function(child){
	      console.log(" " + i++ + " ");
	  });
      });

  }
});
