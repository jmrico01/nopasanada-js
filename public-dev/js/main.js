let tableFields = [
    [ "date", "Date" ],
    [ "type", "Type" ],
    [ "title", "Title" ],
    [ "link", "ID / URL" ],
];

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
            tableHtml += "</tr>\n";
        }

        $("#entryTable").html(tableHtml);
    });

    $("#diffButton").click(function() {
        $.get("/diff", function(data) {
            console.log(data);
        });
    });
});
