"use strict";

function AspectChanged(narrow)
{
    if (narrow) {
        cssNarrow.href = "../../../css/article-narrow.css";
    }
    else {
        cssNarrow.href = "";
    }
}

function OnResize()
{
    // Called from resize.js
}

$(document).ready(function() {
    $("#content").css("visibility", "visible");
});
