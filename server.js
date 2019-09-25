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

const serverSettings = require("./server-settings.js");

const app = express();

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
    description: "",
    url: "",
    image: "",

    color: "",
    subtitle: "",
    author: "",
    date: "",
    text: ""
};
templates.newsletter.requiredParameters = {
    title: "",
    description: "",
    url: "",
    image: "",

    imageDirectory: "",
    audioSource: "",
    color: "",

    title1: "",
    author1: "",
    text1: "",

    title2: "",
    author2: "",
    text2: "",

    title3: "",
    author3: "",
    text3: "",

    title4: "",
    author4: "",
    text4: ""
};
templates.video.requiredParameters = {
    title: "",
    description: "",
    url: "",
    image: "",

    videoID: "",
    color: "",
    subtitle: "",
    author: "",
    date: "",
    text: ""
};

function GetEntryData(url, callback)
{
    let xmlPath = path.join(__dirname, path.normalize(url + ".xml"));
    fs.readFile(xmlPath, function(err, data) {
        if (err) {
            console.error("Failed to read XML file at " + xmlPath);
            console.error(err);
            callback(404, null, null);
            return;
        }

        parseXMLString(data, function(err, result) {
            if (err) {
                console.error("Failed to parse XML file data at " + xmlPath);
                console.error(err);
                callback(500, null, null);
                return;
            }

            let resultContentType = null;
            let parameters = null;
            for (let contentType in templates) {
                if (result.hasOwnProperty(contentType)) {
                    resultContentType = contentType;
                    parameters = result[contentType];
                    break;
                }
            }
            if (resultContentType === null || parameters === null) {
                console.error("Unknown content type, don't know which template to use");
                callback(500, null, null);
                return;
            }

            for (let k in parameters) {
                parameters[k] = parameters[k][0];
                if (k === "featured") {
                    for (let kFeatured in parameters[k]) {
                        parameters[k][kFeatured] = parameters[k][kFeatured][0].trim();
                    }
                    continue;
                }
                else if (k === "tags") {
                    parameters[k] = parameters[k].split(",");
                    for (let i = 0; i < parameters[k].length; i++) {
                        parameters[k][i] = parameters[k][i].trim();
                    }
                    continue;
                }
                parameters[k] = parameters[k].trim();
            }

            callback(200, resultContentType, parameters);
        });
    });
}

let allContent = [];
{
    let allContentDirs = fs.readdirSync(path.join(__dirname, "content"));
    for (let i = 0; i < allContentDirs.length; i++) {
        let dirName = allContentDirs[i];
        if (dirName === "templates") {
            continue;
        }
        let allContentUnderDir = fs.readdirSync(path.join(__dirname, "content", dirName));
        for (let j = 0; j < allContentUnderDir.length; j++) {
            let contentFileName = allContentUnderDir[j];
            if (contentFileName.length <= 4) {
                throw new Error("File name too short for .xml extension " + dirName + "/" + contentFileName);
            }
            let uri = "/content/" + dirName + "/"
                + contentFileName.substring(0, contentFileName.length - 4);
            GetEntryData(uri, function(status, contentType, parameters) {
                if (status !== 200) {
                    throw new Error("GetEntryData failed: " + uri + " status " + status);
                }

                if (!parameters.hasOwnProperty("imagePoster") && !parameters.hasOwnProperty("image")) {
                    throw new Error("no image on file " + uri);
                }
                if (!parameters.hasOwnProperty("titlePoster") && !parameters.hasOwnProperty("title")) {
                    throw new Error("no title on file " + uri);
                }
                if (!parameters.hasOwnProperty("day") && !parameters.hasOwnProperty("month") && !parameters.hasOwnProperty("year")) {
                    throw new Error("no day/month/year on file " + uri);
                }

                if (!parameters.hasOwnProperty("tags")) {
                    throw new Error("no tags data on file " + uri);
                }
                if (!parameters.hasOwnProperty("featured")) {
                    throw new Error("no featured data on file " + uri);
                }
                let featuredInfo = parameters.featured;
                if (!featuredInfo.hasOwnProperty("images")) {
                    throw new Error("no images on featured info, file " + uri);
                }
                if (!featuredInfo.hasOwnProperty("pretitle")) {
                    throw new Error("no pretitle on featured info, file " + uri);
                }
                if (!featuredInfo.hasOwnProperty("title")) {
                    throw new Error("no title on featured info, file " + uri);
                }
                if (!featuredInfo.hasOwnProperty("text1")) {
                    throw new Error("no text1 on featured info, file " + uri);
                }
                if (!featuredInfo.hasOwnProperty("text2")) {
                    throw new Error("no text2 on featured info, file " + uri);
                }
                if (!featuredInfo.hasOwnProperty("highlightColor")) {
                    throw new Error("no highlightColor on featured info, file " + uri);
                }

                let featuredImages = featuredInfo.images;
                featuredImages = featuredImages.split(",");
                for (let k = 0; k < featuredImages.length; k++) {
                    featuredImages[k] = featuredImages[k].trim();
                    if (featuredImages[k] === "") {
                        throw new Error("blank featured image (trailing comma?), file " + uri);
                    }
                }
                let imagePoster = parameters.hasOwnProperty("imagePoster") ? parameters.imagePoster : parameters.image;
                let titlePoster = parameters.hasOwnProperty("titlePoster") ? parameters.titlePoster : parameters.title;
                let dayPoster = parameters.day;
                while (dayPoster.length < 2) {
                    dayPoster = "0" + dayPoster;
                }
                let monthPoster = parameters.month;
                while (monthPoster.length < 2) {
                    monthPoster = "0" + monthPoster;
                }
                let yearPoster = parameters.year;
                if (yearPoster.length !== 4) {
                    throw new Error("poster incomplete year / bad format: " + uri);
                }
                let datePoster = parameters.year + "-" + monthPoster + "-" + dayPoster;
                allContent.push({
                    featuredInfo: {
                        images: featuredImages,
                        pretitle: featuredInfo.pretitle,
                        title: featuredInfo.title,
                        text1: featuredInfo.text1,
                        text2: featuredInfo.text2,
                        highlightColor: featuredInfo.highlightColor
                    },
                    tags: parameters.tags,
                    link: uri,
                    image: imagePoster,
                    title: titlePoster,
                    date: datePoster
                });
            });
        }
    }
}

// Backwards compatibility
app.get("/el-caso-diet-prada", function(req, res) {
    res.redirect("/content/201908/el-caso-diet-prada");
});
app.get("/la-cerveza-si-es-cosa-de-mujeres", function(req, res) {
    res.redirect("/content/201908/la-cerveza-si-es-cosa-de-mujeres");
});
app.get("/content0/201908/el-amazonas", function(req, res) {
    res.redirect("/content/201908/newsletter-29");
});
app.get("/content0/201909/newsletter-03", function(req, res) {
    res.redirect("/content/201909/newsletter-03");
});
// =======================

app.get("/content/*/*", function(req, res) {
    let requestPath = req.path;
    if (requestPath[requestPath.length - 1] === "/") {
        requestPath = requestPath.substring(0, requestPath.length - 1);
    }
    GetEntryData(requestPath, function(status, contentType, parameters) {
        if (status != 200) {
            res.status(status).end();
            return;
        }

        if (parameters.hasOwnProperty("author") && parameters.author !== "") {
            parameters.author = "POR " + parameters.author.toUpperCase();
        }
        if (parameters.hasOwnProperty("author1") && parameters.author1 !== "") {
            parameters.author1 = "POR " + parameters.author1.toUpperCase();
        }
        if (parameters.hasOwnProperty("author2") && parameters.author2 !== "") {
            parameters.author2 = "POR " + parameters.author2.toUpperCase();
        }
        if (parameters.hasOwnProperty("author3") && parameters.author3 !== "") {
            parameters.author3 = "POR " + parameters.author3.toUpperCase();
        }
        if (parameters.hasOwnProperty("author4") && parameters.author4 !== "") {
            parameters.author4 = "POR " + parameters.author4.toUpperCase();
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
        if (contentType === "newsletter") {
            for (let t = 1; t <= 4; t++) {
                let tttt = "text" + t.toString();
                parameters[tttt] = converter.makeHtml(parameters[tttt]);
                let formattedText = "";
                let textSplit = parameters[tttt].split("\n");
                for (let i = 0; i < textSplit.length; i++) {
                    textSplit[i] = textSplit[i].trim();
                    if (textSplit[i] !== "") {
                        formattedText += "<p>" + textSplit[i] + "</p>";
                    }
                }
                parameters[tttt] = formattedText;
            }
        }
        else {
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
        }

        const templateObject = templates[contentType];
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

app.post("/entries", function(req, res) {
    let category = req.query.category;
    // TODO filter content based on category
    // TODO move this sort until after allContent is ready (but async... bleh)
    let filteredContent = allContent.slice(0);
    filteredContent.sort(function(a, b) {
        // descending date order
        return a.date > b.date ? -1 : 1;
    });
    res.status(200).send(filteredContent);
});

app.use(express.static(path.join(__dirname, "/public")));

let credentials = null;
if (serverSettings.isHttps) {
    const privateKey = fs.readFileSync("./keys/privkey.pem", "utf8");
    const cert = fs.readFileSync("./keys/cert.pem", "utf8");
    const ca = fs.readFileSync("./keys/chain.pem", "utf8");
    credentials = {
        key: privateKey,
        cert: cert,
        ca: ca
    };

    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(serverSettings.port, function() {
        console.log("HTTPS server listening on port " + serverSettings.port);
    });
}
else {
    const httpServer = http.createServer(app);
    httpServer.listen(serverSettings.port, function() {
        console.log("HTTP server listening on port " + serverSettings.port);
    });
}

if (serverSettings.isDev) {
    const appDev = express();

    appDev.post("/content/*/*", function(req, res) {
        let requestPath = req.path;
        if (requestPath[requestPath.length - 1] === "/") {
            requestPath = requestPath.substring(0, requestPath.length - 1);
        }
        GetEntryData(requestPath, function(status, contentType, parameters) {
            if (status != 200) {
                res.status(status).end();
                return;
            }

            parameters.contentType = contentType;
            res.status(200).send(parameters);
        });
    });

    appDev.post("/entries", function(req, res) {
        let content = allContent.slice(0);
        content.sort(function(a, b) {
            // descending date order
            return a.date > b.date ? -1 : 1;
        });
        res.status(200).send(content);
    });

    appDev.use(bodyParser.json());
    appDev.use(express.static(path.join(__dirname, "/public-dev")));

    if (serverSettings.isHttps) {
        const httpsServerDev = https.createServer(credentials, appDev);
        httpsServerDev.listen(serverSettings.portDev, function() {
            console.log("HTTPS dev server listening on port " + serverSettings.portDev);
        });
    }
    else {
        const httpServerDev = http.createServer(appDev);
        httpServerDev.listen(serverSettings.portDev, function() {
            console.log("HTTP dev server listening on port " + serverSettings.portDev);
        });
    }
}
