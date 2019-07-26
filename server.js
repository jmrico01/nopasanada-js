const bodyParser = require("body-parser");
const cson = require("cson");
const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const util = require("util");

const PORT_HTTP = 8080;
const PORT_HTTPS = 8181;
const app = express();

const privateKey = fs.readFileSync(
	"/etc/letsencrypt/live/kapricornmedia.com-0001/privkey.pem", "utf8");
const cert = fs.readFileSync(
	"/etc/letsencrypt/live/kapricornmedia.com-0001/cert.pem", "utf8");
const ca = fs.readFileSync(
	"/etc/letsencrypt/live/kapricornmedia.com-0001/chain.pem", "utf8");

const credentials = {
	key: privateKey,
	cert: cert,
	ca: ca
};

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));

// Serve post entries
app.post("/posts", function(req, res) {
	var MAX_POSTS = 20;

	var type = req.query.type;
	if (typeof(type) !== "string") {
		res.status(400);
		res.send("Type argument invalid");
		return;
	}

	var names = req.body;
	if (!Array.isArray(names) || names.length > MAX_POSTS) {
		res.status(400);
		res.send("Names not an array or larger than "
			+ MAX_POSTS + " elements");
		return;
	}

	var result = [];
	for (var i = 0; i < names.length; i++) {
		var postFilePath = path.join(__dirname, "/posts", type,
			names[i] + ".cson");
		try {
			var postData = cson.parse(fs.readFileSync(postFilePath));
		} catch (e) {
			res.status(400);
			res.send("Requested non-existent file: " + postFilePath);
			return;
		}
		result.push(postData);
	}

	res.send(result);
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(PORT_HTTP, function() {
	console.log("HTTP server listening on port " + PORT_HTTP);
});
httpsServer.listen(PORT_HTTPS, function() {
	console.log("HTTPS server listening on port " + PORT_HTTPS);
});
