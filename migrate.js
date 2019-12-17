const fs = require("fs");
const path = require("path");
const showdown = require("showdown");
const util = require("util");
const xml2jsParseString = require("xml2js").parseString;

const PATHS = [
    "/content/201908",
    "/content/201909",
    "/content/201910",
    "/content/201911",
    "/content/201912"
];

const CONTENT_TYPES = [
    "article",
    "newsletter",
    "text",
    "video"
];

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

    let xmlPath = path.join(__dirname, path.normalize(url + ".xml"));
    let xmlDir = path.dirname(xmlPath);
    if (!fs.existsSync(xmlDir)) {
        await mkdirAsync(xmlDir, { recursive: true });
    }
    await writeFileAsync(xmlPath, xml);
}

(async function() {
    const CONVERT_FIELDS = [ "text1", "text2", "text3", "text4", "text" ];
    const TEMPLATES = {
        "article": null,
        "newsletter": null,
        "text": null,
        "video": null
    };
    for (let i = 0; i < PATHS.length; i++) {
        let files = fs.readdirSync(path.join(__dirname, PATHS[i]));
        for (let f = 0; f < files.length; f++) {
            let uriEnd = files[f].substring(0, files[f].length - 4);
            let uri = PATHS[i] + "/" + uriEnd;
            console.log(uri);
            const {status, contentType, entryData} = await GetEntryData(uri, TEMPLATES);
            if (status != 200) {
                throw new Error("Failed to get entry data for " + uri);
            }
            for (let cf = 0; cf < CONVERT_FIELDS.length; cf++) {
                let field = CONVERT_FIELDS[cf];
                if (field in entryData) {
                    let converter = new showdown.Converter();
                    let converted = converter.makeHtml(entryData[field]);
                    let formattedText = "";
                    let textSplit = converted.split("\n");
                    for (let i = 0; i < textSplit.length; i++) {
                        textSplit[i] = textSplit[i].trim();
                        if (textSplit[i] !== "") {
                            formattedText += "<p>" + textSplit[i] + "</p>";
                        }
                    }
                    entryData[field] = formattedText;
                }
            }
            entryData.contentType = contentType;
            await SaveEntryData(uri, TEMPLATES, entryData);
        }
    }
})();
