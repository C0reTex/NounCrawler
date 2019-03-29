var moduleName = 'nounGrawler';

const NounProject = require('the-noun-project');
const fs          = require('fs');
const cmdLine     = require('command-line-args');
const open 	  = require('open');

// Get command line arguments
const cmdOptions = [
    { name: 'config', alias: 'c', type: String},
    { name: 'search', alias: 's', type: String}
]
var cmdArgs = cmdLine(cmdOptions);


// Read config.json file
if (cmdArgs.config == undefined) {
    var config = JSON.parse(fs.readFileSync('config.json'));
} else {
    var config = JSON.parse(fs.readFileSync(cmdArgs.config));

}
var KEY = config.key
var SECRET = config.secret;

// Prepare Search
var search;
if (cmdArgs.search == undefined)
    search = 'Error'
else
    search = cmdArgs.search

var options = {
  limit_to_public_domain : 1,
    searchTerm: search,
  limit: 5
}


// Prepare connection to API with KEY and SECRET
const nounProject = new NounProject({
         key: KEY,
         secret: SECRET
    });


// Search for a term

nounProject.getIconsByTerm(options.searchTerm, {limit_to_public_domain : options.limit_to_public_domain},
	(err, data) => {
		if (!err) {
			var html = `
				<html>
				<header>
				<title>The Noun Crawler</title>
				</header>
				<body>
				`;

			data['icons'].forEach(function(icon){
				var img = '<a href="'+icon['icon_url']+'" target="_blank"><img src="'+icon['preview_url']+'" title="'+icon['attributiona']+'"></a>';
				html += img;
			});

			html += `
				</body>
				</html>
				`;
			fs.writeFile('output.html', html, function(err, data) {
				if (err) console.log(err);
				open('output.html');
			});
		}
	});

// create html




function commandLineArguments (callback) {
  for (var i = 2; i < process.argv.length; i++){
    var term = '';
    var regex = '^[^-]{2}.*';
    switch (process.argv[i]) {
      case '-pd':
      case '--publicdomain': options.limit_to_public_domain = 1;
                             break;
      case '-l':
      case '--limit': options.limit = process.argv[++i];
                      break;
      default: options.searchTerm = process.argv[i];
                      break;
    }
    if (i == process.argv.length - 1){
    }
  }
}
