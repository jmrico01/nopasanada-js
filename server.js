const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const mysql = require("mysql");
const path = require("path");
const util = require("util");

const DEBUG = true;

const app = express();

if (DEBUG) {
    const PORT_HTTP = 6060;

    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, "/public")));

    const httpServer = http.createServer(app);

    httpServer.listen(PORT_HTTP, function() {
        console.log("HTTP server listening on port " + PORT_HTTP);
    });
}
else {
    const PORT_HTTP = 7070;
    const PORT_HTTPS = 7171;

    const dbConnection = mysql.createConnection({
        host: "localhost",
        user: "demouser",
        password: "password",
        database: "nopasanada"
    });

    dbConnection.connect(function(error) {
        if (error) {
            console.error(error);
        }

        console.log("Connected to database");
    });

    dbConnection.query("SELECT * FROM raw", function(error, results, fields) {
        if (error) {
            console.error(error);
        }

        console.log("query results:");
        console.log(results);
        // console.log(fields);
    });

    const privateKey = fs.readFileSync("./keys/privkey.pem", "utf8");
    const cert = fs.readFileSync("./keys/cert.pem", "utf8");
    const ca = fs.readFileSync("./keys/chain.pem", "utf8");

    const credentials = {
    	key: privateKey,
    	cert: cert,
    	ca: ca
    };

    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, "/public")));

    const httpServer = http.createServer(app);
    const httpsServer = https.createServer(credentials, app);

    httpServer.listen(PORT_HTTP, function() {
    	console.log("HTTP server listening on port " + PORT_HTTP);
    });
    httpsServer.listen(PORT_HTTPS, function() {
    	console.log("HTTPS server listening on port " + PORT_HTTPS);
    });
}
