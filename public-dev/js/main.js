let tableFields = [
    [ "date", "Date" ],
    [ "type", "Type" ],
    [ "title", "Title" ],
    [ "link", "ID / URL" ],
];

let commitInProgress_ = false;

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
            done("Cancelled");
        }
    });

    $.get("/entries", function(data) {
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
                contentType: "application/json",
                async: true,
                data: "",
                success: function(data) {
                    $("#statusMessage").html("Successfully commited changes!");
                },
                error: function(error) {
                    $("#statusMessage").html("Commit failed, error: " + error);
                }
            });
        }
    });
});
