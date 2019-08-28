const assert = require("assert");
const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const mustache = require("mustache");
const parseXMLString = require("xml2js").parseString;
const path = require("path");
const showdown = require("showdown");
const util = require("util");

const DEBUG = true;

const app = express();
const appDev = express();

let templates = {};
let templateFiles = fs.readdirSync(path.join(__dirname, "/content/templates"));
for (let i = 0; i < templateFiles.length; i++) {
    let templateFileSplit = templateFiles[i].split(".");
    assert(templateFileSplit.length === 2);
    assert(templateFileSplit[0].length > 0);
    assert(templateFileSplit[1] === "html");

    let templateName = templateFileSplit[0];
    let fullPath = path.join(__dirname, "/content/templates/", templateFiles[i]);
    templates[templateName] = {
        template: fs.readFileSync(fullPath).toString(),
        requiredParameters: {}
    };
    mustache.parse(templates[templateName].template);
}

templates.article.requiredParameters = {
    title: "",
    subtitle: "",
    author: "",
    date: "",
    description: "",
    url: "",
    image: "",
    color: "",
    text: ""
};
templates.video.requiredParameters = {
    title: "",
    subtitle: "",
    author: "",
    date: "",
    description: "",
    url: "",
    image: "",
    id: "",
    color: "",
    text: ""
};

// Backwards compatibility
app.get("/el-caso-diet-prada", function(req, res) {
    res.redirect("/content/201908/el-caso-diet-prada");
});
app.get("/la-cerveza-si-es-cosa-de-mujeres", function(req, res) {
    res.redirect("/content/201908/la-cerveza-si-es-cosa-de-mujeres");});
// =======================

app.get("/content/*/*", function(req, res) {
    let requestPath = req.path;
    if (requestPath[requestPath.length - 1] === "/") {
        requestPath = requestPath.substring(0, requestPath.length - 1);
    }

    let xmlPath = path.join(__dirname, path.normalize(requestPath + ".xml"));
    fs.readFile(xmlPath, function(err, data) {
        if (err) {
            console.error("Failed to read XML file at " + xmlPath);
            console.error(err);
            res.status(404).end();
            return;
        }

        parseXMLString(data, function(err, result) {
            if (err) {
                console.error("Failed to parse XML file data at " + xmlPath);
                console.error(err);
                res.status(500).end();
                return;
            }

            let templateObject = null;
            let parameters = null;
            if (result.hasOwnProperty("article")) {
                templateObject = templates.article;
                parameters = result.article;
            }
            else if (result.hasOwnProperty("video")) {
                templateObject = templates.video;
                parameters = result.video;
            }
            else {
                console.error("Unknown content type, don't know which template to use");
                res.status(500).end();
                return;
            }

            for (let k in parameters) {
                parameters[k] = parameters[k][0].trim();
            }
            if (parameters.author !== "") {
                parameters.author = "POR " + parameters.author.toUpperCase();
            }
            if (parameters.month !== "") {
                const monthNames = [
                    "ENERO", "FEBRERO", "MARZO", "ABRIL",
                    "MAYO", "JUNIO", "JULIO", "AGOSTO",
                    "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
                ];
                let monthIndex = parseInt(parameters.month) - 1;
                parameters.date = parameters.day + " DE " + monthNames[monthIndex];
            }
            else {
                parameters.date = "";
            }
            parameters.url = requestPath;

            let converter = new showdown.Converter();
            parameters.text = converter.makeHtml(parameters.text);
            let formattedText = "";
            let textSplit = parameters.text.split("\n");
            for (let i = 0; i < textSplit.length; i++) {
                textSplit[i] = textSplit[i].trim();
                if (textSplit[i] !== "") {
                    formattedText += "<p>" + textSplit[i] + "</p>";
                }
            }
            parameters.text = formattedText;

            for (let k in templateObject.requiredParameters) {
                if (!parameters.hasOwnProperty(k)) {
                    console.error("Missing required template parameter " + k);
                    res.status(500).end();
                    return;
                }
            }
            let output = mustache.render(templateObject.template, parameters);
            res.status(200).send(output);
        });
    });
});

app.use(express.static(path.join(__dirname, "/public")));

appDev.post("/content", function(req, res) {
    fs.readdir(path.join(__dirname, "content"), function(err, contentDirs) {
        if (err) {
            res.send(500).end();
            return;
        }

        let completed = 0;
        let allFilePaths = [];
        for (let i = 0; i < contentDirs.length; i++) {
            if (contentDirs[i] === "templates") {
                continue;
            }

            let dirPath = path.join("content", contentDirs[i]);
            fs.readdir(path.join(__dirname, dirPath), function(err, contentFiles) {
                if (err) {
                    res.send(500).end();
                    return;
                }

                for (let j = 0; j < contentFiles.length; j++) {
                    allFilePaths.push(path.join(dirPath, contentFiles[j]));
                }
                completed += 1;

                if (completed === contentDirs.length - 1) {
                    res.status(200).send(allFilePaths);
                }
            });
        }
    });
});

appDev.use(bodyParser.json());
appDev.use(express.static(path.join(__dirname, "/public-dev")));

if (DEBUG) {
    const PORT_PUBLIC_HTTP = 6060;
    const PORT_DEV_HTTP = 6061;

    const httpServer = http.createServer(app);
    httpServer.listen(PORT_PUBLIC_HTTP, function() {
        console.log("HTTP server listening on port " + PORT_PUBLIC_HTTP);
    });

    const httpServerDev = http.createServer(appDev);
    httpServerDev.listen(PORT_DEV_HTTP, function() {
        console.log("HTTP dev server listening on port " + PORT_DEV_HTTP);
    });
}
else {
    const PORT_PUBLIC_HTTPS = 7070;
    const PORT_DEV_HTTPS = 7071;

    const privateKey = fs.readFileSync("./keys/privkey.pem", "utf8");
    const cert = fs.readFileSync("./keys/cert.pem", "utf8");
    const ca = fs.readFileSync("./keys/chain.pem", "utf8");

    const credentials = {
    	key: privateKey,
    	cert: cert,
    	ca: ca
    };

    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(PORT_PUBLIC_HTTPS, function() {
        console.log("HTTPS server listening on port " + PORT_PUBLIC_HTTPS);
    });

    const httpsServerDev = https.createServer(credentials, appDev);
    httpsServerDev.listen(PORT_DEV_HTTPS, function() {
        console.log("HTTPS dev server listening on port " + PORT_DEV_HTTPS);
    });
}
