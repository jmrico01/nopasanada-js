const FEATURED_TAG_PREFIX = "featured-";
const TABLE_FIELDS = [
    [ "date" , "Date"     ],
    [ "type" , "Type"     ],
    [ "title", "Title"    ],
    [ "tags" , "Tags"     ],
    [ "link" , "ID / URL" ],
];

let commitInProgress_ = false;
let deployInProgress_ = false;

let entryData_ = null;

function FormatTableFieldValue(tableField, entry)
{
    const entryValue = entry[tableField[0]];
    if (tableField[0] === "link") {
        return "<a href=\"/entry?entry=" + entryValue + "\">" + entryValue + "</a>";
    }
    else if (tableField[0] === "title") {
        return "<i>" + entryValue + "</i>";
    }
    else if (tableField[0] === "tags") {
        let html = "";
        let featuredCategories = [];
        for (let i = 0; i < entryValue.length; i++) {
            let tag = entryValue[i];
            if (tag.length > FEATURED_TAG_PREFIX.length
            && tag.substring(0, FEATURED_TAG_PREFIX.length) == FEATURED_TAG_PREFIX) {
                let featuredCategory = tag.substring(FEATURED_TAG_PREFIX.length, tag.length);
                html += "<b>" + featuredCategory + "</b> ";
                featuredCategories.push(featuredCategory);
                entryValue[i] = null;
            }
        }
        for (let i = 0; i < entryValue.length; i++) {
            if (entryValue[i] === null || featuredCategories.includes(entryValue[i])) {
                continue;
            }

            html += entryValue[i] + " ";
        }
        return html;
    }
    return entryValue;
}

$(document).ready(function() {
    $(".modal").hide();
    $(".modal").click(function(event) {
        if (event.target === this) {
            $(".modal").hide();
        }
    });

    $.get("/entries", function(data) {
        entryData_ = data;
        let tableHtml = "<tr>";
        for (let j = 0; j < TABLE_FIELDS.length; j++) {
            if (TABLE_FIELDS[j][0] === "date") {
                tableHtml += "<th style=\"width: 64pt;\">";
            }
            else {
                tableHtml += "<th>";
            }
            tableHtml += TABLE_FIELDS[j][1];
            tableHtml += "</th>";
        }
        tableHtml += "</tr>";

        for (let i = 0; i < data.length; i++) {
            const entry = data[i];
            tableHtml += "<tr>";
            for (let j = 0; j < TABLE_FIELDS.length; j++) {
                tableHtml += "<td>";
                tableHtml += FormatTableFieldValue(TABLE_FIELDS[j], data[i]);
                tableHtml += "</td>";
            }
            tableHtml += "</tr>";
        }

        $("#entryTable").html(tableHtml);

        let featuredTableHtml = "<tr><th>Tag</th><th>Title</th><th>ID / URL</th></tr>";
        let categoryFeatured = {};
        for (let i = 0; i < data.length; i++) {
            const entry = data[i];
            for (let j = 0; j < entry.featuredTags.length; j++) {
                categoryFeatured[entry.featuredTags[j]] = entry;
            }
        }
        for (let category in categoryFeatured) {
            const entry = categoryFeatured[category];
            featuredTableHtml += "<tr><td>" + category
                + "</td><td>" + FormatTableFieldValue(TABLE_FIELDS[2], entry)
                + "</td><td>" + FormatTableFieldValue(TABLE_FIELDS[4], entry)
                + "</td></tr>\n";
        }

        $("#featuredEntryTable").html(featuredTableHtml);
    });

    $.ajax({
        type: "GET",
        url: "/previewSite",
        contentType: "application/json",
        dataType: "json",
        async: true,
        data: "",
        success: function(data) {
            let previewUrl = data.url;
            $("#previewLink").attr("href", previewUrl);
        },
        error: function(error) {
            console.error(error);
        }
    });

    $("#newEntryButton").click(function() {
        let newEntryHtml = "<h1>New Entry</h1>";
        newEntryHtml += "<form id=\"newEntryForm\">";
        // URI (name)
        newEntryHtml += "<h3>URL</h3>/content/201910/ <input type=\"text\" name=\"uniqueName\"></input><br>";
        // Copy from
        newEntryHtml += "<h3>Copy from</h3><select name=\"copyFrom\"><option value=\"none\">None</option>";
        for (let i = 0; i < entryData_.length; i++) {
            newEntryHtml += "<option value=\"" + entryData_[i].link + "\">" + entryData_[i].link + "</option>";
        }
        newEntryHtml += "</select><br>";
        // Content type
        newEntryHtml += "<h3>or Type (if \"Copy from: None\")</h3><select name=\"contentType\"><option value=\"article\">article</option><option value=\"newsletter\">newsletter</option><option value=\"text\">text</option><option value=\"video\">video</option></select><br>";
        // Submit
        newEntryHtml += "<input type=\"submit\" value=\"Create\"></input>";
        newEntryHtml += "</form>";
        $(".modal-content").html(newEntryHtml);
        $(".modal").show();
        $("#newEntryForm").submit(function(event) {
            event.preventDefault();

            let $form = $("#newEntryForm");
            let uniqueName = $form.find("input[name=uniqueName]").val();
            let uniqueNameRegex = /^[a-z0-9\-]+$/g;
            if (!uniqueNameRegex.test(uniqueName)) {
                $("#statusMessage").html("Entry name should only have lower-case letters, numbers, or dashes.");
                return;
            }
            let copyFrom = $form.find("select[name=copyFrom]").val();
            if (copyFrom === "none") {
                copyFrom = null;
            }
            let formData = {
                uniqueName: uniqueName,
                contentType: $form.find("select[name=contentType]").val(),
                copyFrom: copyFrom
            };
            $.ajax({
                type: "POST",
                url: "/newEntry",
                contentType: "application/json",
                async: true,
                data: JSON.stringify(formData),
                dataType: "text",
                success: function(data) {
                    $("#statusMessage").html("New entry created successfully.");
                    location.reload(true);
                },
                error: function(error) {
                    console.log(error);
                    $("#statusMessage").html("New entry creation failed, error: " + error.responseText);
                }
            });
            $(".modal").hide();
        });
    });

    $("#diffButton").click(function() {
        $.get("/diff", function(data) {
            let diffHtml = "<h1>DIFF</h1>";
            for (let i = 0; i < data.length; i++) {
                diffHtml += "<p>" + data[i].flag + " " + data[i].file + "</p>";
            }
            $(".modal").show();
            $(".modal-content").html(diffHtml);
        });
    });

    $("#commitButton").click(function() {
        if (!commitInProgress_) {
            commitInProgress_ = true;
            $("#statusMessage").html("Committing changes...");
            $.ajax({
                type: "POST",
                url: "/commit",
                contentType: "application/text",
                dataType: "text",
                async: true,
                data: "",
                success: function(data) {
                    $("#statusMessage").html("Commit successful.");
                    commitInProgress_ = false;
                },
                error: function(error) {
                    console.log(error);
                    $("#statusMessage").html("Commit failed, error: " + error.responseText);
                    commitInProgress_ = false;
                }
            });
        }
    });

    $("#deployButton").click(function() {
        if (!deployInProgress_) {
            deployInProgress_ = true;
            $("#statusMessage").html("Deploying changes...");
            $.ajax({
                type: "POST",
                url: "/deploy",
                contentType: "application/text",
                dataType: "text",
                async: true,
                data: "",
                success: function(data) {
                    $("#statusMessage").html("Deploy successful.");
                    deployInProgress_ = false;
                },
                error: function(error) {
                    console.log(error);
                    $("#statusMessage").html("Deploy failed, error: " + error.responseText);
                    deployInProgress_ = false;
                }
            });
        }
    });
});
