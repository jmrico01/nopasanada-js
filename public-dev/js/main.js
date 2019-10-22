let tableFields = [
    [ "date", "Date" ],
    [ "type", "Type" ],
    [ "title", "Title" ],
    [ "link", "ID / URL" ],
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
        let tableHtml = "<tr>\n";
        for (let j = 0; j < tableFields.length; j++) {
            if (tableFields[j][0] === "date") {
                tableHtml += "<th style=\"width: 64pt;\">";
            }
            else {
                tableHtml += "<th>";
            }
            tableHtml += tableFields[j][1];
            tableHtml += "</th>\n";
        }
        tableHtml += "</tr>\n";

        for (let i = 0; i < data.length; i++) {
            const entry = data[i];
            tableHtml += "<tr>\n";
            for (let j = 0; j < tableFields.length; j++) {
                tableHtml += "<td>";
                tableHtml += FormatTableFieldValue(tableFields[j], data[i]);
                tableHtml += "</td>\n";
            }
            tableHtml += "</tr>\n\n";
        }

        $("#entryTable").html(tableHtml);
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
        // TODO(important) implement copy-from thing
        let newEntryHtml = "<h1>New Entry</h1>";

        newEntryHtml += "<form id=\"newEntryForm\">"

        newEntryHtml += "<h3>Type</h3><select name=\"contentType\"><option value=\"article\">article</option><option value=\"newsletter\">newsletter</option><option value=\"text\">text</option><option value=\"video\">video</option></select><br>";
        newEntryHtml += "<h3>URL</h3>/content/201910/ <input type=\"text\" name=\"uniqueName\"></input><br>";

        newEntryHtml += "<select type=\"copyFrom\">";

        newEntryHtml += "</select>";

        newEntryHtml += "<input type=\"submit\" value=\"Create\"></input>";

        newEntryHtml += "</form>";
        $(".modal").show();
        $(".modal-content").html(newEntryHtml);
        $("#newEntryForm").submit(function(event) {
            event.preventDefault();

            let $form = $("#newEntryForm");
            let formData = {
                contentType: $form.find("select[name=contentType]").val(),
                uniqueName: $form.find("input[name=uniqueName]").val()
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
