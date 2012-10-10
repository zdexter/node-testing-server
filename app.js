var util = require("util")
	http = require("http"),
	fs = require("fs"),
	mime = require("mime");
	
base_dir = process.argv[2];
if (typeof(base_dir) === 'undefined') base_dir = process.cwd();

try {
  fs.statSync(base_dir).isDirectory()
} catch (err) {
  console.error('The directory you want to serve files from does not exist.');
  return false;
}

util.log('Serving up static files from ' + base_dir);

function onRequest(request, response) {
	if(request.method === "GET") {
		var path = base_dir+request.url;
		if (request.url.indexOf('favicon.ico') != -1) {
			// Short-circuit favicon requests
			// https://gist.github.com/763822
			response.writeHead(200, {'Content-Type': 'image/x-icon'});
			response.end();
			return;
		}
		fs.readFile(path, "utf-8", function(err, html) {
			if (err){
				util.error('Error trying to read ' + path);
				util.error(err);
				throw err;
			}
			response.writeHeader(200, 
				{"Content-Type": mime.lookup(path)}
			);
			response.write(html);
			response.end();
		});
	} else if(request.method === "POST") {
		var data = "";

		request.on("data", function(chunk) {
			data += chunk;
		});

		request.on("end", function() {
			util.log("raw: " + data);

			response.writeHeader(200,
				{"Content-Type": "text/html"}
			);
			response.write('Uploaded file.');
			response.end();
		});
	}
}

http.createServer(onRequest).listen(8000);