const assert = require("assert");
const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const mustache = require("mustache");
const path = require("path");
const showdown = require("showdown");
const util = require("util");
const xml2jsParseString = require("xml2js").parseString;

// Jesus...
const readdirAsync = util.promisify(fs.readdir);
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
async function parseXMLStringAsync(xmlString)
{
    return new Promise(function(resolve, reject) {
        xml2jsParseString(xmlString, function(err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}

const XML_SINGLE_INDENT_STRING = "    ";
const XML_ESCAPED_CHARS = {
    "<" : "&lt;",
    ">" : "&gt;",
    "&" : "&amp;",
    "\"": "&quot;",
    "\'": "&apos;"
};

function ObjectToXMLRecursive(prefix, object)
{
    let xml = "";
    let type = typeof(object);
    if (type === "object") {
        for (let key in object) {
            let result = ObjectToXMLRecursive(prefix + XML_SINGLE_INDENT_STRING, object[key]);
            if (result !== null) {
                xml += prefix + "<" + key + ">\n";
                xml += result;
                xml += prefix + "</" + key + ">\n";
            }
        }
    }
    else {
        if (object === "undefined") {
            console.warn("\"undefined\" string, treated as undefined value");
            return null;
        }
        let string = prefix + object + "\n";
        for (let i = 0; i < string.length; i++) {
            if (XML_ESCAPED_CHARS.hasOwnProperty(string[i])) {
                string = string.substring(0, i) + XML_ESCAPED_CHARS[string[i]] + string.substring(i + 1, string.length);
            }
        }
        xml += string;
    }

    return xml;
}

function ObjectToXML(rootNode, object)
{
    let result = ObjectToXMLRecursive(XML_SINGLE_INDENT_STRING, object);
    if (result === null) {
        return null;
    }

    let xml = "<" + rootNode + ">\n";
    xml += result;
    xml += "</" + rootNode + ">\n";
    return xml;
}

const serverSettings = require("./server-settings.js");

const app = express();

function LoadTemplateData()
{
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
    templates.text.requiredParameters = {
        title: "",
        description: "",
        url: "",
        image: "",

        color: "",
        subtitle: "",
        subtext1: "",
        subtext2: "",
        text: ""
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

    return templates;
}

async function GetEntryData(url, templates)
{
    let xmlPath = path.join(__dirname, path.normalize(url + ".xml"));
    let fileData;
    try {
        fileData = await readFileAsync(xmlPath);
    }
    catch (e) {
        console.error("Failed to read XML file at " + xmlPath);
        console.error(e);
        return { status: 404, contentType: null, entryData: null };
    }

    let xmlData;
    try {
        xmlData = await parseXMLStringAsync(fileData);
    }
    catch (e) {
        console.error("Failed to parse XML file data at " + xmlPath);
        console.error(e);
        return { status: 500, contentType: null, entryData: null };
    }

    let resultContentType = null;
    let entryData = null;
    for (let contentType in templates) {
        if (xmlData.hasOwnProperty(contentType)) {
            resultContentType = contentType;
            entryData = xmlData[contentType];
            break;
        }
    }
    if (resultContentType === null || entryData === null) {
        console.error("Unknown content type, don't know which template to use");
        return { status: 500, contentType: null, entryData: null };
    }

    for (let k in entryData) {
        entryData[k] = entryData[k][0];
        if (k === "featured") {
            for (let kFeatured in entryData[k]) {
                entryData[k][kFeatured] = entryData[k][kFeatured][0];
                if (kFeatured === "images") {
                    entryData[k][kFeatured] = entryData[k][kFeatured].split(",");
                    for (let i = 0; i < entryData[k][kFeatured].length; i++) {
                        entryData[k][kFeatured][i] = entryData[k][kFeatured][i].trim();
                        if (entryData[k][kFeatured][i] === "") {
                            throw new Error("Empty featured image, maybe a trailing comma? " + url);
                        }
                    }
                }
                else {
                    entryData[k][kFeatured] = entryData[k][kFeatured].trim();
                }
            }
        }
        else if (k === "tags") {
            entryData[k] = entryData[k].split(",");
            for (let i = 0; i < entryData[k].length; i++) {
                entryData[k][i] = entryData[k][i].trim();
            }
        }
        else {
            entryData[k] = entryData[k].trim();
        }
    }

    return { status: 200, contentType: resultContentType, entryData: entryData };
}

async function SaveEntryData(url, templates, entryData)
{
    let contentType = entryData.contentType;
    if (!templates.hasOwnProperty(contentType)) {
        console.error("Unknown contentType, can't save entry data: " + contentType);
        return false;
    }
    delete entryData.contentType;
    let xml = ObjectToXML(contentType, entryData);

    let xmlPath = path.join(__dirname, path.normalize(url + ".xml"));
    await writeFileAsync(xmlPath, xml);

    return true;
}

async function LoadAllEntryMetadata(templates)
{
    let allEntryMetadata = [];
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
            const {status, contentType, entryData} = await GetEntryData(uri, templates);
            if (status !== 200) {
                throw new Error("GetEntryData failed: " + uri + " status " + status);
            }

            if (!entryData.hasOwnProperty("imagePoster") && !entryData.hasOwnProperty("image")) {
                throw new Error("no image on file " + uri);
            }
            if (!entryData.hasOwnProperty("titlePoster") && !entryData.hasOwnProperty("title")) {
                throw new Error("no title on file " + uri);
            }
            if (!entryData.hasOwnProperty("day") && !entryData.hasOwnProperty("month") && !entryData.hasOwnProperty("year")) {
                throw new Error("no day/month/year on file " + uri);
            }

            if (!entryData.hasOwnProperty("tags")) {
                throw new Error("no tags data on file " + uri);
            }
            if (!entryData.hasOwnProperty("featured")) {
                throw new Error("no featured data on file " + uri);
            }
            let featuredInfo = entryData.featured;
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

            let imagePoster = entryData.hasOwnProperty("imagePoster") ? entryData.imagePoster : entryData.image;
            let titlePoster = entryData.hasOwnProperty("titlePoster") ? entryData.titlePoster : entryData.title;
            let dayPoster = entryData.day;
            while (dayPoster.length < 2) {
                dayPoster = "0" + dayPoster;
            }
            let monthPoster = entryData.month;
            while (monthPoster.length < 2) {
                monthPoster = "0" + monthPoster;
            }
            let yearPoster = entryData.year;
            if (yearPoster.length !== 4) {
                throw new Error("poster incomplete year / bad format: " + uri);
            }
            let datePoster = entryData.year + "-" + monthPoster + "-" + dayPoster;
            allEntryMetadata.push({
                featuredInfo: {
                    images: featuredInfo.images,
                    pretitle: featuredInfo.pretitle,
                    title: featuredInfo.title,
                    text1: featuredInfo.text1,
                    text2: featuredInfo.text2,
                    highlightColor: featuredInfo.highlightColor
                },
                type: contentType,
                tags: entryData.tags,
                link: uri,
                image: imagePoster,
                title: titlePoster,
                date: datePoster
            });
        }
    }

    for (let i = 0; i < allEntryMetadata.length; i++) {
        
    }

    return allEntryMetadata;
}

let allEntryMetadata_, templates_;
(async function() {
    templates_ = LoadTemplateData();
    allEntryMetadata_ = await LoadAllEntryMetadata(templates_);
})();

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

app.get("/content/*/*", async function(req, res) {
    let requestPath = req.path;
    if (requestPath[requestPath.length - 1] === "/") {
        requestPath = requestPath.substring(0, requestPath.length - 1);
    }
    const {status, contentType, entryData} = await GetEntryData(requestPath, templates_);
    if (status != 200) {
        res.status(status).end();
        return;
    }

    if (entryData.hasOwnProperty("author") && entryData.author !== "") {
        entryData.author = "POR " + entryData.author.toUpperCase();
    }
    if (entryData.hasOwnProperty("author1") && entryData.author1 !== "") {
        entryData.author1 = "POR " + entryData.author1.toUpperCase();
    }
    if (entryData.hasOwnProperty("author2") && entryData.author2 !== "") {
        entryData.author2 = "POR " + entryData.author2.toUpperCase();
    }
    if (entryData.hasOwnProperty("author3") && entryData.author3 !== "") {
        entryData.author3 = "POR " + entryData.author3.toUpperCase();
    }
    if (entryData.hasOwnProperty("author4") && entryData.author4 !== "") {
        entryData.author4 = "POR " + entryData.author4.toUpperCase();
    }
    if (entryData.hasOwnProperty("subtext1") && entryData.subtext1 !== "") {
        entryData.subtext1 = entryData.subtext1.toUpperCase();
    }
    if (entryData.hasOwnProperty("subtext2") && entryData.subtext2 !== "") {
        entryData.subtext2 = entryData.subtext2.toUpperCase();
    }
    if (entryData.month !== "") {
        const monthNames = [
            "ENERO", "FEBRERO", "MARZO", "ABRIL",
            "MAYO", "JUNIO", "JULIO", "AGOSTO",
            "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
        ];
        let monthIndex = parseInt(entryData.month) - 1;
        entryData.date = entryData.day + " DE " + monthNames[monthIndex];
    }
    else {
        entryData.date = "";
    }
    entryData.url = requestPath;

    let converter = new showdown.Converter();
    if (contentType === "newsletter") {
        for (let t = 1; t <= 4; t++) {
            let tttt = "text" + t.toString();
            entryData[tttt] = converter.makeHtml(entryData[tttt]);
            let formattedText = "";
            let textSplit = entryData[tttt].split("\n");
            for (let i = 0; i < textSplit.length; i++) {
                textSplit[i] = textSplit[i].trim();
                if (textSplit[i] !== "") {
                    formattedText += "<p>" + textSplit[i] + "</p>";
                }
            }
            entryData[tttt] = formattedText;
        }
    }
    else {
        entryData.text = converter.makeHtml(entryData.text);
        let formattedText = "";
        let textSplit = entryData.text.split("\n");
        for (let i = 0; i < textSplit.length; i++) {
            textSplit[i] = textSplit[i].trim();
            if (textSplit[i] !== "") {
                formattedText += "<p>" + textSplit[i] + "</p>";
            }
        }
        entryData.text = formattedText;
    }

    const templateObject = templates_[contentType];
    for (let k in templateObject.requiredParameters) {
        if (!entryData.hasOwnProperty(k)) {
            console.error("Missing required template parameter " + k);
            res.status(500).end();
            return;
        }
    }
    let output = mustache.render(templateObject.template, entryData);
    res.status(200).send(output);
});

app.post("/entries", function(req, res) {
    let category = req.query.category;
    // TODO filter content based on category
    // TODO move this sort until after allEntryMetadata_ is ready (but async... bleh)
    let filteredContent = allEntryMetadata_.slice(0);
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
    function isAuthenticated(req) {
        return false; // TODO authentication logic
    }
    function checkAuthRedirect(req, res, next) {
        if (!isAuthenticated(req)) {
            res.redirect("/login");
        }
        else {
            next();
        }
    }
    function checkAuthNoRedirect(req, res, next) {
        if (!isAuthenticated(req)) {
            res.send("UNAUTHORIZED");
        }
        else {
            next();
        }
    }

    const appDev = express();

    appDev.post("/newImage", checkAuthNoRedirect, async function(req, res) {
        console.log(req);
        console.log(req.body);
        res.end();
    });

    appDev.use(express.json());

    appDev.get("/entries", checkAuthNoRedirect, function(req, res) {
        let content = allEntryMetadata_.slice(0);
        content.sort(function(a, b) {
            // descending date order
            return a.date > b.date ? -1 : 1;
        });
        res.status(200).send(content);
    });

    appDev.get("/content/*/*", checkAuthNoRedirect, async function(req, res) {
        let requestPath = req.path;
        if (requestPath[requestPath.length - 1] === "/") {
            requestPath = requestPath.substring(0, requestPath.length - 1);
        }

        const {status, contentType, entryData} = await GetEntryData(requestPath, templates_);
        if (status != 200) {
            res.status(status).end();
            return;
        }

        entryData.contentType = contentType;
        res.status(200).send(entryData);
    });

    appDev.post("/content/*/*", checkAuthNoRedirect, async function(req, res) {
        let requestPath = req.path;
        if (requestPath[requestPath.length - 1] === "/") {
            requestPath = requestPath.substring(0, requestPath.length - 1);
        }

        await SaveEntryData(requestPath, templates_, req.body);

        // Reload global data
        templates_ = LoadTemplateData();
        allEntryMetadata_ = await LoadAllEntryMetadata(templates_);
    });

    appDev.get("/", checkAuthRedirect);
    appDev.get("/entry", checkAuthRedirect);

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
