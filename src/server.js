const assert = require("assert");
const busboy = require("connect-busboy");
const cookieParser = require("cookie-parser");
const { exec } = require("child_process");
const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const LocalStrategy = require("passport-local").Strategy;
const mustache = require("mustache");
const passport = require("passport");
const path = require("path");
const serverSettings = require("./server-settings.js");
const session = require("express-session");
const util = require("util");
const xml2jsParseString = require("xml2js").parseString;

const ROOT_DIR = path.join(__dirname, "..");
const GLOBAL_DATA_PATH = path.join(ROOT_DIR, "data", "globalData.js");

let globalData = require(GLOBAL_DATA_PATH);

// Jesus...
const mkdirAsync     = util.promisify(fs.mkdir);
const readdirAsync   = util.promisify(fs.readdir);
const readFileAsync  = util.promisify(fs.readFile);
const unlinkAsync    = util.promisify(fs.unlink);
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
    let attributes = [];
    let type = typeof(object);
    if (type === "object") {
        for (let key in object) {
            if (key === "_") {
                // TODO same as bottom "else" case
                let string = prefix + object[key] + "\n";
                for (let i = 0; i < string.length; i++) {
                    if (XML_ESCAPED_CHARS.hasOwnProperty(string[i])) {
                        string = string.substring(0, i) + XML_ESCAPED_CHARS[string[i]] + string.substring(i + 1, string.length);
                    }
                }
                xml += string;
            }
            else if (key === "$") {
                for (let attrName in object[key]) {
                    attributes.push({
                        name: attrName,
                        value: object[key][attrName]
                    });
                }
            }
            else {
                // TODO same as top-level function
                let result = ObjectToXMLRecursive(prefix + XML_SINGLE_INDENT_STRING, object[key]);
                if (result !== null) {
                    xml += prefix + "<" + key;
                    for (let i = 0; i < result.attributes.length; i++) {
                        xml += " " + result.attributes[i].name + "=" + "\"" + result.attributes[i].value + "\"";
                    }
                    xml += ">\n";
                    xml += result.text;
                    xml += prefix + "</" + key + ">\n";
                }
            }
        }
    }
    else {
        if (object !== "") {
            let string = prefix + object + "\n";
            for (let i = 0; i < string.length; i++) {
                if (XML_ESCAPED_CHARS.hasOwnProperty(string[i])) {
                    string = string.substring(0, i) + XML_ESCAPED_CHARS[string[i]] + string.substring(i + 1, string.length);
                }
            }
            xml += string;
        }
    }

    return {
        text: xml,
        attributes: attributes
    };
}

function ObjectToXML(rootNode, object)
{
    let result = ObjectToXMLRecursive(XML_SINGLE_INDENT_STRING, object);
    if (result === null) {
        return null;
    }

    let xml = "<" + rootNode;
    for (let i = 0; i < result.attributes.length; i++) {
        xml += " " + result.attributes[i].name + "=" + "\"" + result.attributes[i].value + "\"";
    }
    xml += ">\n";
    xml += result.text;
    xml += "</" + rootNode + ">\n";
    return xml;
}

// TODO duplicated in main.js
function GetDateStringsFromUnixTime(unixTime)
{
    let date = new Date(unixTime);
    let dayString = date.getDate().toString();
    if (dayString.length < 2) {
        dayString = "0" + dayString;
    }
    else if (dayString.length > 2) {
        throw new Error("day string on date has length > 2");
    }
    let monthString = (date.getMonth() + 1).toString();
    if (monthString.length < 2) {
        monthString = "0" + monthString;
    }
    else if (monthString.length > 2) {
        throw new Error("month string on date has length > 2");
    }
    return {
        day: dayString,
        month: monthString,
        year: date.getFullYear().toString()
    };
}

let blankSlates = {};
let commonSlate = {
    featured: {
        pretitle: "",
        title: "",
        text1: "",
        text2: "",
        highlightColor: ""
    },
    media: {
        header: {
            "_": "/images/unused/garrazo.jpg",
            "$": {
                "type": "image"
            }
        }
    },
    tags: [],
    title: "",
    titlePoster: "",
    description: "",
    day: "",
    month: "",
    year: "",
    color: ""
};

blankSlates.article = commonSlate;
blankSlates.article.author = "";
blankSlates.article.subtitle = "";
blankSlates.article.text = "";

blankSlates.newsletter = commonSlate;
blankSlates.newsletter.title1 = "";
blankSlates.newsletter.author1 = "";
blankSlates.newsletter.text1 = "";
blankSlates.newsletter.title2 = "";
blankSlates.newsletter.author2 = "";
blankSlates.newsletter.text2 = "";
blankSlates.newsletter.title3 = "";
blankSlates.newsletter.author3 = "";
blankSlates.newsletter.text3 = "";
blankSlates.newsletter.title4 = "";
blankSlates.newsletter.author4 = "";
blankSlates.newsletter.text4 = "";

blankSlates.text = commonSlate;
blankSlates.text.subtext1 = "";
blankSlates.text.subtext2 = "";
blankSlates.text.subtitle = "";
blankSlates.text.text = "";

blankSlates.video = commonSlate;
blankSlates.video.videoID = "";
blankSlates.video.author = "";
blankSlates.video.subtitle = "";
blankSlates.video.text = "";

const app = express();

function LoadTemplateData()
{
    let templates = {};
    let templateFiles = fs.readdirSync(path.join(ROOT_DIR, "/content/templates"));
    for (let i = 0; i < templateFiles.length; i++) {
        let templateFileSplit = templateFiles[i].split(".");
        assert(templateFileSplit.length === 2);
        assert(templateFileSplit[0].length > 0);
        assert(templateFileSplit[1] === "html");

        let templateName = templateFileSplit[0];
        let fullPath = path.join(ROOT_DIR, "/content/templates/", templateFiles[i]);
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
        // image: "",

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
        //image: "",

        //imageDirectory: "",
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
        // image: "",

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
        // image: "",

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
    let xmlPath = path.join(ROOT_DIR, path.normalize(url + ".xml"));
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
                entryData[k][kFeatured] = entryData[k][kFeatured][0].trim();
            }
        }
        else if (k === "media") {
            if (typeof entryData[k] === "string") {
                entryData[k] = {};
            }
            for (let k2 in entryData[k]) {
                entryData[k][k2] = entryData[k][k2][0];
                entryData[k][k2]._ = entryData[k][k2]._.trim();
                if (!entryData[k][k2].hasOwnProperty("$")) {
                    throw new Error("Media " + k2 + " missing properties. " + url);
                }
                if (!entryData[k][k2].$.hasOwnProperty("type")) {
                    throw new Error("Media " + k2 + " missing type property. " + url);
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

    if (!("media" in entryData)) {
        throw new Error("no media on file " + url);
    }
    if (!("header" in entryData.media)) {
        throw new Error("no header on file media " + url);
    }
    if (!("titlePoster" in entryData) && !("title" in entryData)) {
        throw new Error("no title on file " + url);
    }
    if (!("day" in entryData) || !("month" in entryData) || !("year" in entryData)) {
        throw new Error("no day/month/year on file " + url);
    }
    if (!("tags" in entryData)) {
        throw new Error("no tags data on file " + url);
    }
    if (!("featured" in entryData)) {
        throw new Error("no featured data on file " + url);
    }
    let featuredInfo = entryData.featured;
    if (!("pretitle" in featuredInfo)) {
        throw new Error("no pretitle on featured info, file " + url);
    }
    if (!("title" in featuredInfo)) {
        throw new Error("no title on featured info, file " + url);
    }
    if (!("text1" in featuredInfo)) {
        throw new Error("no text1 on featured info, file " + url);
    }
    if (!("text2" in featuredInfo)) {
        throw new Error("no text2 on featured info, file " + url);
    }
    if (!("highlightColor" in featuredInfo)) {
        throw new Error("no highlightColor on featured info, file " + url);
    }

    return { status: 200, contentType: resultContentType, entryData: entryData };
}

async function SaveEntryData(url, templates, entryData)
{
    let contentType = entryData.contentType;
    if (!templates.hasOwnProperty(contentType)) {
        throw new Error("Unknown contentType, can't save entry data: " + contentType);
    }
    delete entryData.contentType;
    entryData.tags = entryData.tags.join(", ");
    let xml = ObjectToXML(contentType, entryData);

    let xmlPath = path.join(ROOT_DIR, path.normalize(url + ".xml"));
    let xmlDir = path.dirname(xmlPath);
    if (!fs.existsSync(xmlDir)) {
        await mkdirAsync(xmlDir, { recursive: true });
    }
    await writeFileAsync(xmlPath, xml);
}

async function DeleteEntry(url)
{
    let xmlPath = path.join(ROOT_DIR, path.normalize(url + ".xml"));
    await unlinkAsync(xmlPath);
}

async function LoadAllEntryMetadata(templates)
{
    let allEntryMetadata = [];
    let allContentDirs = fs.readdirSync(path.join(ROOT_DIR, "content"));
    for (let i = 0; i < allContentDirs.length; i++) {
        let dirName = allContentDirs[i];
        if (dirName === "templates") {
            continue;
        }
        let allContentUnderDir = fs.readdirSync(path.join(ROOT_DIR, "content", dirName));
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

            let imagePoster = ("poster" in entryData.media) ? entryData.media.poster._ : entryData.media.header._;
            let titlePoster = entryData.title;
            if (entryData.hasOwnProperty("titlePoster") && entryData.titlePoster.trim() !== "") {
                titlePoster = entryData.titlePoster;
            }
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
            let featuredImages = [ entryData.media.header._ ];
            if ("featured1" in entryData.media) {
                featuredImages = [ entryData.media.featured1._ ];
                let featuredN = 2;
                while (true) {
                    let featuredKey = "featured" + featuredN.toString();
                    if (!(featuredKey in entryData.media)) {
                        break;
                    }
                    featuredImages.push(entryData.media[featuredKey]._);
                    featuredN++;
                }
            }
            allEntryMetadata.push({
                featuredInfo: {
                    images: featuredImages,
                    pretitle: entryData.featured.pretitle,
                    title: entryData.featured.title,
                    text1: entryData.featured.text1,
                    text2: entryData.featured.text2,
                    highlightColor: entryData.featured.highlightColor
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

    allEntryMetadata.sort(function(a, b) {
        // descending date order
        return a.date > b.date ? -1 : 1;
    });
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

    const templateObject = templates_[contentType];
    for (let k in templateObject.requiredParameters) {
        if (!entryData.hasOwnProperty(k)) {
            console.error("Missing required template parameter " + k);
            res.status(500).end();
            return;
        }
    }
    entryData.image = entryData.media.header._;
    if (contentType === "newsletter") {
        entryData["header-desktop1"] = entryData.media["header-desktop1"]._;
        entryData["header-desktop2"] = entryData.media["header-desktop2"]._;
        entryData["header-desktop3"] = entryData.media["header-desktop3"]._;
        entryData["header-desktop4"] = entryData.media["header-desktop4"]._;
        entryData["header-mobile1"] = entryData.media["header-mobile1"]._;
        entryData["header-mobile2"] = entryData.media["header-mobile2"]._;
        entryData["header-mobile3"] = entryData.media["header-mobile3"]._;
        entryData["header-mobile4"] = entryData.media["header-mobile4"]._;
    }
    // Normal template pass
    let output = mustache.render(templateObject.template, entryData);

    let media = {};
    for (let k in entryData.media) {
        let content = entryData.media[k]._;
        let type = entryData.media[k].$.type;
        let style = entryData.media[k].$.style;
        if (style === undefined) {
            style = "";
        }
        if (type !== "image") {
            console.error("Unsupported media type " + type);
        }
        media[k] = {
            content: content,
            type: type,
            style: style
        };
    }

    const BAD_MEDIA_TAG_ERROR = "$$ ERROR! BAD MEDIA TAG $$";
    const MEDIA_TAGS = [
        {
            tag: "image",
            content: function(arg, style, entryMedia) {
                if (!(arg in entryMedia)) {
                    return BAD_MEDIA_TAG_ERROR;
                }
                return "<img style=\"" + entryMedia[arg].style + "\" src=\"../../.."
                    + entryMedia[arg].content + "\">";
            }
        },
        {
            tag: "youtube",
            content: function(arg, style, entryMedia) {
                return "<iframe style=\"width: 100%; height: 40vw;\" src=\"https://www.youtube.com/embed/" + arg + "\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>";
            }
        },
        {
            tag: "vimeo",
            content: function(arg, style, entryMedia) {
                return "<div style=\"padding:56.25% 0 0 0;position:relative;\"><iframe src=\"https://player.vimeo.com/video/" + arg + "?title=0&byline=0&portrait=0\" style=\"position:absolute;top:0;left:0;width:100%;height:100%;\" frameborder=\"0\" allow=\"autoplay; fullscreen\" allowfullscreen></iframe></div><script src=\"https://player.vimeo.com/api/player.js\"></script>";
            }
        },
        {
            tag: "instagram",
            content: function(arg, style, entryMedia) {
                return "<blockquote class=\"instagram-media\" data-instgrm-permalink=\"https://www."
                    + "instagram.com/p/" + arg + "/\" data-instgrm-version=\"12\" style=\" "
                    + "background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 "
                    + "rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; min-width:326px;"
                    + " padding:0; width:100%;\"><div style=\"padding:16px;\"> <a href=\"https://"
                    + "www.instagram.com/p/" + arg + "/\" style=\" background:#FFFFFF; "
                    + "line-height:0; padding:0 0; text-align:center; text-decoration:none; "
                    + "width:100%;\" target=\"_blank\"> <div style=\" display: flex; "
                    + "flex-direction: row; align-items: center;\"> <div style=\"background-color: "
                    + "#F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: "
                    + "14px; width: 40px;\"></div> <div style=\"display: flex; flex-direction: "
                    + "column; flex-grow: 1; justify-content: center;\"> <div style=\" "
                    + "background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; "
                    + "margin-bottom: 6px; width: 100px;\"></div> <div style=\" background-color: "
                    + "#F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;\">"
                    + "</div></div></div><div style=\"padding: 19% 0;\"></div> <div style=\"display"
                    + ":block; height:50px; margin:0 auto 12px; width:50px;\"><svg width=\"50px\" "
                    + "height=\"50px\" viewBox=\"0 0 60 60\" version=\"1.1\" xmlns=\"https://www."
                    + "w3.org/2000/svg\" xmlns:xlink=\"https://www.w3.org/1999/xlink\"><g stroke=\""
                    + "none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"><g "
                    + "transform=\"translate(-511.000000, -20.000000)\" fill=\"#000000\"><g><path "
                    + "d=\"M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,"
                    + "36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,"
                    + "34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,"
                    + "60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 "
                    + "C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 "
                    + "541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899"
                    + " 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,"
                    + "41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606"
                    + " 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155"
                    + " 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378"
                    + " C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 "
                    + "528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 "
                    + "520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 "
                    + "C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996"
                    + " 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978"
                    + " 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894"
                    + " C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756"
                    + " 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448"
                    + " 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654"
                    + " C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938"
                    + " 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,"
                    + "41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,"
                    + "62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 "
                    + "C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,"
                    + "22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 "
                    + "C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18"
                    + " C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,"
                    + "23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349"
                    + " C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 "
                    + "511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,"
                    + "67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 "
                    + "C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,"
                    + "79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 "
                    + "C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 "
                    + "560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296"
                    + " 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369"
                    + " C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"
                    + "\"></path></g></g></g></svg></div><div style=\"padding-top: 8px;\"> "
                    + "<div style=\" color:#3897f0; font-family:Arial,sans-serif; font-size:14px;"
                    + " font-style:normal; font-weight:550; line-height:18px;\"> View this post on"
                    + " Instagram</div></div><div style=\"padding: 12.5% 0;\"></div> <div style="
                    + "\"display: flex; flex-direction: row; margin-bottom: 14px; align-items: "
                    + "center;\"><div> <div style=\"background-color: #F4F4F4; border-radius: 50%;"
                    + " height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"
                    + "\"></div> <div style=\"background-color: #F4F4F4; height: 12.5px; transform:"
                    + " rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow:"
                    + " 0; margin-right: 14px; margin-left: 2px;\"></div> <div style=\""
                    + "background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: "
                    + "12.5px; transform: translateX(9px) translateY(-18px);\"></div></div><div "
                    + "style=\"margin-left: 8px;\"> <div style=\" background-color: #F4F4F4; "
                    + "border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;\"></div> "
                    + "<div style=\" width: 0; height: 0; border-top: 2px solid transparent; "
                    + "border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; "
                    + "transform: translateX(16px) translateY(-4px) rotate(30deg)\"></div></div>"
                    + "<div style=\"margin-left: auto;\"> <div style=\" width: 0px; border-top: "
                    + "8px solid #F4F4F4; border-right: 8px solid transparent; transform: "
                    + "translateY(16px);\"></div> <div style=\" background-color: #F4F4F4; "
                    + "flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);\">"
                    + "</div> <div style=\" width: 0; height: 0; border-top: 8px solid #F4F4F4; "
                    + "border-left: 8px solid transparent; transform: translateY(-4px) "
                    + "translateX(8px);\"></div></div></div> <div style=\"display: flex; "
                    + "flex-direction: column; flex-grow: 1; justify-content: center; "
                    + "margin-bottom: 24px;\"> <div style=\" background-color: #F4F4F4; "
                    + "border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: "
                    + "224px;\"></div> <div style=\" background-color: #F4F4F4; border-radius: "
                    + "4px; flex-grow: 0; height: 14px; width: 144px;\"></div></div></a><p style=\""
                    + " color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; "
                    + "line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; "
                    + "padding:8px 0 7px; text-align:center; text-overflow:ellipsis; "
                    + "white-space:nowrap;\"><a href=\"https://www.instagram.com/p/" + arg + "/\" "
                    + "style=\" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; "
                    + "font-style:normal; font-weight:normal; line-height:17px; text-decoration:"
                    + "none;\" target=\"_blank\">A post shared by Diet Prada ™ (@diet_prada)</a> "
                    + "on <time style=\" font-family:Arial,sans-serif; font-size:14px; "
                    + "line-height:17px;\" datetime=\"2019-07-22T15:25:36+00:00\">Jul 22, 2019 at "
                    + "8:25am PDT</time></p></div></blockquote><script async src=\"//www."
                    + "instagram.com/embed.js\"></script>";
            }
        }
    ];

    for (let i = 0; i < MEDIA_TAGS.length; i++) {
        let tag = "$" + MEDIA_TAGS[i].tag + "/";
        while (true) {
            let index = output.indexOf(tag);
            if (index === -1) {
                break;
            }
            let argStart = index + tag.length;
            let argEnd = argStart;
            while (argEnd < output.length && output[argEnd] !== "$") {
                argEnd++;
            }
            let contentString;
            if (argEnd >= output.length) {
                contentString = BAD_MEDIA_TAG_ERROR;
            }
            else {
                let arg = output.slice(argStart, argEnd);
                let style = "";
                contentString = MEDIA_TAGS[i].content(arg, style, media)
            }
            output = [
                output.slice(0, index),
                contentString,
                output.slice(argEnd + 1, output.length)
            ].join("");
        }
    }

    res.status(200).send(output);
});

app.get("/entries", function(req, res) {
    let category = req.query.category;
    // TODO filter content based on category
    let filteredContent = allEntryMetadata_.slice(0);
    res.status(200).send(filteredContent);
});

app.get("/featured", function(req, res) {
    res.status(200).send(globalData.featured);
});

app.use(express.static(path.join(ROOT_DIR, "/public")));

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
    function isAuthenticatedRedirect(req, res, next) {
        if (req.user) {
            next();
        }
        else {
            res.redirect("/login");
        }
    }
    function isAuthenticatedNoRedirect(req, res, next) {
        if (req.user) {
            next();
        }
        else {
            res.status(401).end();
        }
    }

    function isUsernameAndPasswordCorrect(username, password) {
        return username === "admin" && password === "NoPasaNothing";
    }

    passport.use(new LocalStrategy({
        usernameField: "username",
        passwordField: "password",
    }, function(username, password, done) {
        if (isUsernameAndPasswordCorrect(username, password)) {
            console.log(username + " : logged in on " + Date(Date.now()).toString());
            done(null, {
                id: username
            });
        }
        else {
            done(null, false, { message: "Invalid username and/or password." });
        }
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id); // TODO identity for now
    });

    passport.deserializeUser(function(userID, done) {
        done(null, {
            id: userID
        });
    });

    const appDev = express();

    appDev.use(express.json({ limit: "10MB" }));
    appDev.use(express.urlencoded({ extended: true }));

    appDev.use(cookieParser());
    appDev.use(session({
        secret: "keyboard-cat",
        resave: true,
        saveUninitialized: false
    }));
    appDev.use(passport.initialize());
    appDev.use(passport.session());

    appDev.post("/authenticate", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
    }));

    appDev.use("/newImage", busboy());
    appDev.post("/newImage", isAuthenticatedNoRedirect, async function(req, res, next) {
        req.pipe(req.busboy);

        let npnEntryPath = null;
        let npnLabel = null;
        req.busboy.on("field", function(fieldName, value, fieldNameTruncated, valueTruncated, encoding, mimetype) {
            if (fieldName === "npnEntryPath") {
                npnEntryPath = value;
            }
            else if (fieldName === "npnLabel") {
                npnLabel = value;
            }
        });

        let fstream;
        req.busboy.on("file", async function(fieldName, file, fileName) {
            while (npnEntryPath === null || npnLabel === null);
            let entryPathSplit = npnEntryPath.split("/");
            let uri = "/images" + "/" + entryPathSplit[entryPathSplit.length - 2] + "/";
            if (npnLabel === "header") {
                uri += "headers/" + entryPathSplit[entryPathSplit.length - 1] + ".jpg";
            }
            else if (npnLabel === "poster") {
                uri += "posters/" + entryPathSplit[entryPathSplit.length - 1] + ".jpg";
            }
            else if (npnLabel.includes("header-desktop")) {
                let number = npnLabel[npnLabel.length - 1];
                if (number !== "1" && number !== "2" && number !== "3" && number !== "4") {
                    console.error("Invalid npnLabel: " + npnLabel);
                    res.status(400).end("<error>Invalid npn label " + npnLabel + "</error>");
                    return;
                }
                uri += entryPathSplit[entryPathSplit.length - 1] + "/vertical" + number + ".jpg";
            }
            else if (npnLabel.includes("header-mobile")) {
                let number = npnLabel[npnLabel.length - 1];
                if (number !== "1" && number !== "2" && number !== "3" && number !== "4") {
                    console.error("Invalid npnLabel: " + npnLabel);
                    res.status(400).end("<error>Invalid npn label " + npnLabel + "</error>");
                    return;
                }
                uri += entryPathSplit[entryPathSplit.length - 1] + "/square" + number + ".jpg";
            }
            else {
                let npnLabelRegex = /^[a-z0-9\-]+$/g;
                if (!npnLabelRegex.test(npnLabel)) {
                    res.status(400).end("<error>Invalid npn label " + npnLabel + "</error>");
                    return;
                }
                uri += entryPathSplit[entryPathSplit.length - 1] + "/" + npnLabel + ".jpg";
            }

            let filePath = path.join(ROOT_DIR, "public", uri);
            let fileDir = path.dirname(filePath);
            if (!fs.existsSync(fileDir)) {
                try {
                    // TODO seems like recursive isn't actually working?
                    await mkdirAsync(fileDir, { recursive: true });
                }
                catch (e) {
                    console.error(e);
                    res.status(400).end("Failed to create image directory");
                    return;
                }
            }

            console.log("Uploading " + fileName + " to " + filePath);
            fstream = fs.createWriteStream(filePath, {
                flags: "w+"
            });
            file.pipe(fstream);
            fstream.on("close", function() {
                console.log("Upload finished for " + filePath + ", uri " + uri);
                res.status(200).end("<uri>" + uri + "</uri>");
            });
        });
    });

    appDev.get("/previewSite", isAuthenticatedNoRedirect, function(req, res) {
        let url = "https://preview.nopasanada.com";
        if (!serverSettings.isHttps) {
            url = "http://localhost:" + serverSettings.port;
        }
        res.status(200).send({
            url: url
        });
    });

    appDev.get("/entries", isAuthenticatedNoRedirect, function(req, res) {
        res.status(200).send(allEntryMetadata_);
    });

    appDev.get("/featured", function(req, res) {
        res.status(200).send(globalData.featured);
    });

    appDev.post("/featured", async function(req, res) {
        let newFeatured = req.body;
        let globalDataContents = "exports.featured = " + JSON.stringify(newFeatured, null, 4) + ";";
        await writeFileAsync(GLOBAL_DATA_PATH, globalDataContents);
        delete require.cache[require.resolve(GLOBAL_DATA_PATH)];
        globalData = require(GLOBAL_DATA_PATH);
        res.status(200).end();
    });

    appDev.get("/content/*/*", isAuthenticatedNoRedirect, async function(req, res) {
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

    appDev.get("/diff", isAuthenticatedNoRedirect, async function(req, res) {
        exec("git diff --name-status", (err, stdout, stderr) => {
            if (err) {
                console.error("Error when running git diff: " + stderr);
                res.status(500).end();
                return;
            }

            let diffFiles = [];
            let stdoutLines = stdout.split("\n");
            for (let i = 0; i < stdoutLines.length; i++) {
                let stdoutLine = stdoutLines[i].trim();
                if (stdoutLine === "") {
                    continue;
                }
                let pair = stdoutLine.split(/\s+/);
                if (pair.length !== 2) {
                    console.error("Diff pair not length 2");
                    res.status(500).end();
                    continue;
                }
                diffFiles.push({
                    file: pair[1],
                    flag: pair[0]
                });
            }
            res.status(200).send(diffFiles);
        });
    });

    appDev.post("/newEntry", isAuthenticatedNoRedirect, async function(req, res) {
        let name = req.body.uniqueName;
        let contentType = req.body.contentType;
        let copyFrom = req.body.copyFrom;

        let entryData;
        if (copyFrom === null) {
            if (!blankSlates.hasOwnProperty(contentType)) {
                res.status(500).end("Invalid content type");
                return;
            }
            entryData = blankSlates[contentType];
            entryData.contentType = contentType;
        }
        else {
            const result = await GetEntryData(copyFrom, templates_);
            if (result.status != 200) {
                res.status(result.status).end("Failed to get existing entry data");
                return;
            }
            entryData = result.entryData;
            entryData.contentType = result.contentType;
        }

        let dateStrings = GetDateStringsFromUnixTime(Date.now());
        entryData.year = dateStrings.year;
        entryData.month = dateStrings.month;
        entryData.day = dateStrings.day;

        let uri = "content" + "/" + dateStrings.year + dateStrings.month + "/" + name;
        try {
            await SaveEntryData(uri, templates_, entryData);
        }
        catch (e) {
            console.error(e);
            res.status(500).end("Failed to save new entry data");
            return;
        }
        console.log("Saved new entry " + uri);
        try {
            templates_ = LoadTemplateData();
            allEntryMetadata_ = await LoadAllEntryMetadata(templates_);
        }
        catch (e) {
            console.error(e);
            res.status(500).end("Failed to reload entry data");
            return;
        }
        res.status(200).end();
    });

    appDev.post("/deleteEntry", isAuthenticatedNoRedirect, async function(req, res) {
        let uri = req.body.uri;
        try {
            await DeleteEntry(uri);
        }
        catch (e) {
            console.error(e);
            res.status(500).end("Failed to delete entry");
            return;
        }
        console.log("Deleted entry " + uri);
        try {
            templates_ = LoadTemplateData();
            allEntryMetadata_ = await LoadAllEntryMetadata(templates_);
        }
        catch (e) {
            console.error(e);
            res.status(500).end("Failed to reload entry data");
            return;
        }
        res.status(200).end();
    });

    appDev.post("/content/*/*", isAuthenticatedNoRedirect, async function(req, res) {
        let requestPath = req.path;
        if (requestPath[requestPath.length - 1] === "/") {
            requestPath = requestPath.substring(0, requestPath.length - 1);
        }

        try {
            await SaveEntryData(requestPath, templates_, req.body);
        }
        catch (e) {
            console.error(e);
            res.status(500).end("Failed to save entry data");
            return;
        }
        console.log("Saved entry " + requestPath);

        try {
            templates_ = LoadTemplateData();
            allEntryMetadata_ = await LoadAllEntryMetadata(templates_);
        }
        catch (e) {
            console.error(e);
            res.status(500).end("Failed to reload entry data");
            return;
        }
        res.status(200).end();
    });

    appDev.post("/reset", isAuthenticatedNoRedirect, async function(req, res) {
        console.log("Pull + reset request received");
        const gitPullCommands = "git pull && pm2 restart npn-dev";
        exec(gitPullCommands, function(err, stdout, stderr) {
            console.log("Executed reset commands:");
            console.log(gitPullCommands);
            console.log("");
            console.log(stdout);
            if (err) {
                console.error("Reset commands error: " + stderr);
                res.status(500).end("Reset error");
                return;
            }

            res.status(200).end();
        });
    });

    appDev.post("/commit", isAuthenticatedNoRedirect, async function(req, res) {
        console.log("Commit request received");
        const commitMessage = "backend, " + Date(Date.now()).toString();
        const gitCommitCommands =
            "git add -A && " +
            "git commit -m \"" + commitMessage + "\" && " +
            "git push";
        exec(gitCommitCommands, function(err, stdout, stderr) {
            console.log("Executed git commit commands:");
            console.log(gitCommitCommands);
            console.log("");
            console.log(stdout);
            if (err) {
                console.error("git commit commands error: " + stderr);
                res.status(500).end("Commit error");
                return;
            }

            console.log("added, commited, and pushed | " + commitMessage);
            res.status(200).end();
        });
    });

    appDev.post("/deploy", isAuthenticatedNoRedirect, async function(req, res) {
        console.log("Deploy request received");
        exec("cd ../nopasanada && git pull && pm2 restart npn", function(err, stdout, stderr) {
            console.log(stdout);
            if (err) {
                console.error("deploy failed: " + stderr);
                res.status(500).end("exec error");
                return;
            }

            res.status(200).end();
        });
    });

    appDev.get("/", isAuthenticatedRedirect);
    appDev.get("/entry", isAuthenticatedRedirect);

    appDev.use(express.static(path.join(ROOT_DIR, "/public-dev")));

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
