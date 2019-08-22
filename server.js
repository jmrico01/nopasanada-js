const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const mysql = require("mysql");
const path = require("path");
const util = require("util");

const DEBUG = false;

const app = express();

// Backwards compatibility
app.get("/el-caso-diet-prada", function(req, res) {
    res.sendFile("public/content/201908/el-caso-diet-prada/index.html",
        { root: __dirname });
});
app.get("/la-cerveza-si-es-cosa-de-mujeres", function(req, res) {
    res.sendFile("public/content/201908/la-cerveza-si-es-cosa-de-mujeres/index.html",
        { root: __dirname });
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));

if (DEBUG) {
    const PORT_HTTP = 6060;

    const httpServer = http.createServer(app);
    httpServer.listen(PORT_HTTP, function() {
        console.log("HTTP server listening on port " + PORT_HTTP);
    });
}
else {
    const PORT_HTTPS = 7070;

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

    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(PORT_HTTPS, function() {
    	console.log("HTTPS server listening on port " + PORT_HTTPS);
    });
}
